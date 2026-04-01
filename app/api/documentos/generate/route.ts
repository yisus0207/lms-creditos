import { NextRequest, NextResponse } from 'next/server';
import { DocumentoService } from '@/services/documento.service';
import { ClienteService } from '@/services/cliente.service';

export async function POST(req: NextRequest) {
  try {
    const { clienteId, tipo } = await req.json();

    if (!clienteId || !tipo) {
      return NextResponse.json({ error: 'Faltan parámetros: clienteId o tipo' }, { status: 400 });
    }

    const cliente = await ClienteService.getClienteById(clienteId);
    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    let buffer: Buffer;
    let fileName: string;

    if (tipo === 'viabilidad') {
      buffer = await DocumentoService.generateViabilidad(cliente);
      fileName = `Viabilidad_${cliente.nombre.replace(/\s+/g, '_')}.docx`;
    } else if (tipo === 'contrato') {
      buffer = await DocumentoService.generateContrato(cliente);
      fileName = `Contrato_${cliente.nombre.replace(/\s+/g, '_')}.docx`;
    } else {
      return NextResponse.json({ error: 'Tipo de documento no válido' }, { status: 400 });
    }

    // Return the file as a stream (Using Uint8Array for compatibility)
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating document:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
