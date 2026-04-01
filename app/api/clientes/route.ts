import { NextResponse } from 'next/server';

/**
 * GET /api/clientes
 * Phase 4: Replace with Supabase query via ClienteService.getAll()
 */
export async function GET() {
  return NextResponse.json({ data: [], message: 'Conectar Supabase en Fase 3' });
}

/**
 * POST /api/clientes
 * Phase 4: Implement creation via ClienteService.create()
 */
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    { data: null, message: 'Crear cliente – Fase 4', received: body },
    { status: 201 }
  );
}
