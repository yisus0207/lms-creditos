import { supabase } from '@/lib/supabase';

export interface WhatsAppMessage {
  id?: string;
  cliente_id?: string | null;
  telefono: string;
  direccion: 'entrante' | 'saliente';
  tipo: 'texto' | 'imagen' | 'documento' | 'audio' | 'sistema';
  contenido: string;
  url_archivo?: string;
  nombre_archivo?: string;
  whatsapp_message_id?: string;
  metadata?: any;
  created_at?: string;
}

class WhatsAppService {
  /**
   * Intenta encontrar un cliente basándose en el número de teléfono
   */
  async identifyClient(phone: string): Promise<string | null> {
    // Limpiamos el número (WhatsApp usualmente manda country code, ej: 573001234567)
    // Buscamos los últimos 10 dígitos para evitar problemas de código de país
    const phoneSuffix = phone.slice(-10);
    
    const { data } = await supabase
      .from('clientes')
      .select('id')
      .ilike('telefono', `%${phoneSuffix}%`)
      .limit(1)
      .single();

    return data?.id || null;
  }

  /**
   * Guarda un mensaje en el historial
   */
  async saveMessage(msg: WhatsAppMessage) {
    const { data, error } = await supabase
      .from('whatsapp_mensajes')
      .insert(msg)
      .select()
      .single();

    if (error) {
      console.error('Error guardando mensaje de WhatsApp:', error);
      throw error;
    }
    return data;
  }

  /**
   * Obtiene el historial de chat de un cliente
   */
  async getChatHistory(clienteId: string, limit = 50) {
    const { data, error } = await supabase
      .from('whatsapp_mensajes')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    // Invertimos para que los más antiguos queden arriba
    return data.reverse();
  }

  /**
   * Envía un mensaje de texto usando la API oficial de WhatsApp
   */
  async sendTextMessage(toPhone: string, text: string) {
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
      throw new Error('Credenciales de WhatsApp no configuradas en el entorno');
    }

    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toPhone,
        type: 'text',
        text: { preview_url: true, body: text }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Error de Meta API:', data);
      throw new Error(`WhatsApp API Error: ${data.error?.message || 'Error desconocido'}`);
    }

    return data;
  }
}

export const whatsappService = new WhatsAppService();
