import { NextResponse } from 'next/server';
import { whatsappService } from '@/services/whatsapp.service';

// Este token es el que tú inventas y configuras en el panel de Meta
// Meta te lo pide para confirmar que este webhook es realmente tuyo
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'lms_creditos_secure_token_123';

/**
 * Método GET: Se usa EXCLUSIVAMENTE para que Meta verifique el Webhook (paso inicial)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  // Verifica el token
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado correctamente por Meta');
    return new NextResponse(challenge, { status: 200 }); // Meta exige que retornes el challenge en plano
  } else {
    console.error('❌ Falló la verificación del Webhook', { mode, token });
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }
}

/**
 * Método POST: Aquí es donde Meta "empuja" los mensajes entrantes en tiempo real
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verificamos que venga de la API Graph de WhatsApp
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ error: 'Not a WhatsApp Event' }, { status: 404 });
    }

    // Navegamos la estructura del JSON de Meta
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    // Si no hay mensaje (puede ser un evento de cambio de estado), respondemos 200
    if (!message) {
      return NextResponse.json({ status: 'success' }, { status: 200 });
    }

    const telefono = message.from; // Número del cliente (ej: 573001234567)
    const nombreWhatsapp = contact?.profile?.name || 'Cliente';
    const messageId = message.id;

    console.log(`📩 Mensaje entrante de WhatsApp: ${telefono}`);

    // === 1. IDENTIFICAR CLIENTE ===
    const clienteId = await whatsappService.identifyClient(telefono);

    // === 2. CLASIFICAR TIPO DE MENSAJE ===
    let contenido = '';
    let tipo: 'texto' | 'imagen' | 'documento' | 'audio' = 'texto';
    let mediaId = null;

    if (message.type === 'text') {
      contenido = message.text.body;
    } 
    else if (message.type === 'image') {
      tipo = 'imagen';
      mediaId = message.image.id;
      contenido = message.image.caption || '[Imagen recibida]';
    } 
    else if (message.type === 'document') {
      tipo = 'documento';
      mediaId = message.document.id;
      contenido = message.document.caption || `[Documento: ${message.document.filename}]`;
    }
    else if (message.type === 'audio') {
      tipo = 'audio';
      mediaId = message.audio.id;
      contenido = '[Nota de voz recibida]';
    } else {
      contenido = `[Mensaje tipo no soportado: ${message.type}]`;
    }

    // === 3. GUARDAR EL MENSAJE EN LA BASE DE DATOS ===
    // (Aún no procesamos la descarga de media, solo guardamos el registro base)
    await whatsappService.saveMessage({
      cliente_id: clienteId,
      telefono: telefono,
      direccion: 'entrante',
      tipo: tipo,
      contenido: contenido,
      whatsapp_message_id: messageId,
      metadata: { 
        nombre_wa: nombreWhatsapp,
        media_id: mediaId
      }
    });

    // === 4. RESPUESTA AUTOMÁTICA OPCIONAL (FASE 1 = SOLO ACUSE DE RECIBO SI NO ESTÁ REGISTRADO) ===
    if (!clienteId && tipo === 'texto') {
      await whatsappService.sendTextMessage(
        telefono,
        `¡Hola ${nombreWhatsapp}! Gracias por comunicarte con LMS Créditos. Un asesor revisará tu mensaje en breve. Para ayudarnos a identificarte, ¿podrías indicarnos tu número de cédula de ciudadanía?`
      );
    }

    console.log(`✅ Mensaje guardado y procesado exitosamente`);
    
    // Meta SIEMPRE espera un status 200 inmediato para confirmar recepción
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error: any) {
    console.error('🔥 Error crítico en el Webhook de WhatsApp:', error.message);
    // Aunque haya error, respondemos 200 o 500, pero preferible 200 para que Meta no se bloquee reenviando
    return NextResponse.json({ status: 'error', details: error.message }, { status: 500 });
  }
}
