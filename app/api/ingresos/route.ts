import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [], message: 'Conectar Supabase en Fase 3' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    { data: null, message: 'Registrar ingreso – Fase 4', received: body },
    { status: 201 }
  );
}
