import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class ChatService {
  private readonly API_URL = '/api/alexa/chat';
  
  // Cache para el contexto global (3 minutos)
  private contextCache: { data: any; timestamp: number } | null = null;
  private CACHE_TTL = 3 * 60 * 1000; // 3 minutos

  /**
   * Obtiene un resumen completo de la base de datos con caché inteligente
   */
  async getContextSnapshot() {
    const now = Date.now();
    
    // Si tenemos caché válida, la devolvemos
    if (this.contextCache && (now - this.contextCache.timestamp < this.CACHE_TTL)) {
      return this.contextCache.data;
    }

    try {
      // 1. Clientes
      const { data: clientes } = await supabase.from('clientes').select('id, nombre, email, telefono, estado');
      
      // 2. Operaciones
      const { data: operaciones } = await supabase.from('operaciones').select('*, clientes(nombre)');
      
      // 3. Ingresos (Totales)
      const { data: ingresos } = await supabase.from('ingresos').select('monto, estado');
      
      const totalIngresos = ingresos?.reduce((acc, current) => acc + (current.monto || 0), 0) || 0;
      const pagosPendientes = ingresos?.filter(i => i.estado === 'pendiente').length || 0;

      // 4. Estadísticas del Pipeline
      const pipeline = {
        viabilidad: operaciones?.filter(o => o.etapa === 'viabilidad').length || 0,
        documentacion: operaciones?.filter(o => o.etapa === 'documentacion').length || 0,
        banco: operaciones?.filter(o => o.etapa === 'banco').length || 0,
        aprobado: operaciones?.filter(o => o.etapa === 'aprobado').length || 0,
      };

      const result = {
        clientesCount: clientes?.length || 0,
        clientesList: clientes?.slice(0, 20).map(c => `${c.nombre} (${c.estado})`), 
        operaciones: operaciones?.map(o => ({
          cliente: o.clientes?.nombre,
          banco: o.entidad_bancaria,
          monto: o.monto_credito,
          etapa: o.etapa
        })),
        stats: {
          totalIngresos,
          pagosPendientes,
          pipeline
        },
        fechaActual: new Date().toLocaleDateString('es-CO')
      };

      // Guardamos en caché
      this.contextCache = { data: result, timestamp: Date.now() };

      return result;
    } catch (err) {
      console.error('Error al obtener contexto para Alexa:', err);
      return null;
    }
  }

  async sendMessage(messages: ChatMessage[]) {
    const context = await this.getContextSnapshot();
    
    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `Eres Alexa, la asistente inteligente de LMS Créditos, un sistema premium de gestión hipotecaria. 
      Tu objetivo es ayudar al administrador con información precisa, profesional y con un tono NATURAL Y ELEGANTE. 

      REGLAS DE PERSONALIDAD:
      - NO hables como un robot. Usa frases como "Claro que sí", "Permíteme verificar", "Hecho".
      - Sé proactiva. Si alguien pregunta por un cliente, podrías sugerir revisar su documentación.
      - Tu lenguaje debe ser Premium, como si fueras una asistente ejecutiva de alto nivel.

      CONTEXTO ACTUAL DEL SISTEMA (${context?.fechaActual || 'Hoy'}):
      - Clientes Totales: ${context?.clientesCount}
      - Resumen Pipeline: ${JSON.stringify(context?.stats.pipeline)}
      - Ingresos Totales: $${context?.stats.totalIngresos.toLocaleString()}
      - Pagos Pendientes: ${context?.stats.pagosPendientes}
      - Muestra de Operaciones: ${JSON.stringify(context?.operaciones?.slice(0, 15))}

      Si te preguntan algo fuera de este contexto, responde educadamente que tu especialidad es el ecosistema de LMS Créditos.`
    };

    try {
      const response = await fetch('/api/alexa/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [systemPrompt, ...messages]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error('Error en Alexa Service:', err);
      return "Hubo un pequeño contratiempo en mi sistema, pero ya estoy de vuelta. ¿En qué puedo apoyarte ahora?";
    }
  }
}

export const alexaService = new ChatService();
