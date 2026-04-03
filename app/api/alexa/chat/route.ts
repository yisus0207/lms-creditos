import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { messages, tools } = await req.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY no encontrada en process.env');
      return NextResponse.json({ error: 'API Key not configured in Vercel' }, { status: 500 });
    }

    console.log('Iniciando petición a DeepSeek con API Key:', apiKey.substring(0, 5) + '...');

    // 1. Primera llamada para detectar si hay una herramienta que ejecutar
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        tools,
        temperature: 0.5,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error raw:', errorText);
      return NextResponse.json({ 
        error: 'DeepSeek API error', 
        details: errorText.substring(0, 100) 
      }, { status: response.status });
    }

    const data = await response.json();
    const message = data.choices[0].message;

    // 2. Si el modelo quiere ejecutar una herramienta
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      let toolResult = '';

      if (functionName === 'get_financial_report') {
        const { data: ingresos } = await supabase.from('ingresos').select('*');
        const total = ingresos?.reduce((acc, i) => acc + (i.monto || 0), 0) || 0;
        const pendientes = ingresos?.filter(i => i.estado === 'pendiente').reduce((acc, i) => acc + (i.monto || 0), 0) || 0;
        toolResult = `Reporte Financiero: Total ingresos $${total.toLocaleString()}. Pagos pendientes por cobrar: $${pendientes.toLocaleString()}. Todo dentro de los parámetros normales.`;
      } 
      else if (functionName === 'get_stuck_clients') {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: estancados } = await supabase
          .from('clientes')
          .select('nombre, estado, created_at')
          .lt('created_at', sevenDaysAgo)
          .neq('estado', 'aprobado')
          .neq('estado', 'rechazado');
        
        if (estancados && estancados.length > 0) {
          toolResult = `He encontrado ${estancados.length} clientes que podrían estar estancados: ${estancados.map(c => c.nombre).join(', ')}. Te sugiero revisar sus casos.`;
        } else {
          toolResult = "No he encontrado clientes estancados. El flujo se mueve correctamente.";
        }
      }
      else if (functionName === 'find_client_document') {
        const { data: cliente } = await supabase
          .from('clientes')
          .select('id, nombre')
          .ilike('nombre', `%${args.clientName}%`)
          .single();
        
        if (cliente) {
          const { data: docs } = await supabase
            .from('documentos')
            .select('*')
            .eq('cliente_id', cliente.id);
          
          const doc = docs?.find(d => 
            d.tipo_documento.toLowerCase().includes((args.documentType || '').toLowerCase())
          );

          if (doc) {
            const cleanUrl = (doc.url_archivo || '').trim();
            toolResult = `He encontrado el documento "${doc.tipo_documento}" para ${cliente.nombre}. [[DOWNLOAD:${cleanUrl}]]`;
          } else {
            toolResult = `He encontrado al cliente ${cliente.nombre}, pero no tiene un documento tipo "${args.documentType || 'solicitado'}". Tienen subidos: ${docs?.map(d => d.tipo_documento).join(', ') || 'Ninguno'}.`;
          }
        } else {
          toolResult = `No pude encontrar a ningún cliente llamado "${args.clientName}". Por favor verifica el nombre.`;
        }
      }

      // 3. Segunda llamada con el resultado de la herramienta
      const finalResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            ...messages,
            message,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: toolResult
            }
          ],
          temperature: 0.5
        })
      });

      const finalData = await finalResponse.json();
      return NextResponse.json(finalData);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Alexa API Route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
