import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AlexaContext {
  clientesCount: number;
  clientesList: string[];
  operaciones: Array<{
    cliente: string;
    banco: string;
    monto: number;
    etapa: string;
  }>;
  stats: {
    totalIngresos: number;
    pagosPendientes: number;
    pipeline: {
      viabilidad: number;
      documentacion: number;
      banco: number;
      aprobado: number;
    };
  };
  fechaActual: string;
}

class ChatService {
  private readonly API_URL = '/api/alexa/chat';
  
  // Cache para el contexto global (3 minutos)
  private contextCache: { data: AlexaContext; timestamp: number } | null = null;
  private CACHE_TTL = 3 * 60 * 1000; // 3 minutos

  /**
   * Obtiene un resumen completo de la base de datos con caché inteligente
   */
  async getContextSnapshot(): Promise<AlexaContext | null> {
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
        viabilidad: operaciones?.filter(o => o.estado === 'viabilidad').length || 0,
        documentacion: operaciones?.filter(o => o.estado === 'documentos').length || 0,
        banco: operaciones?.filter(o => o.estado === 'banco').length || 0,
        aprobado: operaciones?.filter(o => o.estado === 'aprobado').length || 0,
      };

      const result = {
        clientesCount: clientes?.length || 0,
        clientesList: clientes?.slice(0, 20).map(c => `${c.nombre} (${c.estado})`) || [], 
        operaciones: operaciones?.map(o => ({
          cliente: o.clientes?.nombre,
          banco: o.banco,
          monto: o.monto_credito,
          etapa: o.estado
        })) || [],
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
      content: `Eres Alexa, la Consultora Senior del Portafolio Hipotecario de LMS Créditos. No eres una simple guía; eres la socia estratégica del administrador. 

      PERSONALIDAD Y ROL:
      - Tono: Cálido, seguro de ti misma, profesional y humano. Habla como alguien que lleva 20 años en el sector inmobiliario y bancario.
      - Estilo: Directo y con criterio. Evita sonar como un asistente virtual genérico (nada de "En qué puedo ayudarte hoy" constante). 
      - Criterio de Negocio: Entiendes de LTV (Relación Préstamo-Valor), perfiles de riesgo, procesos de avalúo y escrituración. Si ves muchos clientes en 'Viabilidad' estancados, sugiere mover los procesos.
      
      REGLAS DE INTERACCIÓN:
      1. BREVEDAD EXTREMA: Tu tiempo y el del administrador valen oro. Responde en un máximo de 1-2 párrafos cortos. No repitas datos que ya están en pantalla a menos que sea para un análisis crítico.
      2. SÉ PROACTIVA (PERO DISCRETA): Sugiere una acción solo si es realmente necesaria. No satures con "qué quieres hacer ahora".
      3. NATURALEZA HUMANA: Usa expresiones naturales como "Echémosle un ojo a...", "Mira, encontré esto...", "Listo, aquí lo tienes".
      4. EXPERTA EN VENTAS: Tu enfoque es el cierre. Si te piden un documento, dalo y punto. No hagas un análisis macroeconómico cada vez.

      MANTÉN EL FOCO:
      - Si te preguntan "Hola", responde un saludo cálido de una frase y tal vez una observación corta del pipeline. No mandes un reporte completo sin que te lo pidan.
      - Si te piden un documento, di: "Aquí tienes el [nombre]. [[DOWNLOAD:url_archivo]]" y añade algo breve como "Espero que sirva para el cierre". Nada más.

      CONTEXTO ACTUAL (${context?.fechaActual || 'Hoy'}):
      - Cartera: $${(context?.stats?.totalIngresos || 0).toLocaleString()}.
      - Pipeline: ${context?.stats?.pipeline?.viabilidad || 0} V / ${context?.stats?.pipeline?.documentacion || 0} D / ${context?.stats?.pipeline?.banco || 0} B.
      - Focos (Primeros 3): ${context?.operaciones ? JSON.stringify(context.operaciones.filter((o: any) => o.etapa !== 'aprobado').slice(0, 3)) : 'Sin operaciones activas'}

      MANEJO DE ARCHIVOS:
      Al entregar un documento, usa SIEMPRE: "Aquí tienes el [nombre]. [[DOWNLOAD:url_archivo]]". No te extiendas.`
    };

    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_financial_report',
          description: 'Obtiene un desglose detallado de ingresos, deudas y estado del pipeline.',
          parameters: { type: 'object', properties: {} }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_stuck_clients',
          description: 'Busca clientes que llevan más de 7 días sin cambios en su estado.',
          parameters: { type: 'object', properties: {} }
        }
      },
      {
        type: 'function',
        function: {
          name: 'find_client_document',
          description: 'Busca un documento específico por nombre de cliente y tipo de documento.',
          parameters: {
            type: 'object',
            properties: {
              clientName: { type: 'string', description: 'Nombre completo o parcial del cliente' },
              documentType: { type: 'string', description: 'Tipo de documento (ej: Cédula, Laboral, Rut)' }
            },
            required: ['clientName']
          }
        }
      }
    ];

    try {
      const response = await fetch('/api/alexa/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [systemPrompt, ...messages],
          tools
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      // Si recibimos una respuesta con tool_calls de DeepSeek
      if (data?.choices?.[0]?.message?.tool_calls) {
        // Enviar de vuelta para que el backend procese (o manejar aquí)
        // El backend de la API ya debería haber procesado esto si se llamó con el parámetro tool
        return data.choices[0].message.content || "He procesado tu solicitud con éxito.";
      }

      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        console.error('Respuesta incompleta de DeepSeek:', data);
        return "Disculpa, he tenido un problema al procesar la respuesta. ¿Podrías intentar de nuevo?";
      }

      return content;
    } catch (err: any) {
      console.error('Error profundo en Alexa Service:', err.message);
      return `Hubo un pequeño contratiempo (${err.message}). Pero ya estoy de vuelta. ¿En qué puedo apoyarte ahora?`;
    }
  }
}

export const alexaService = new ChatService();
