// ============================================================
// LMS Créditos – Domain Types
// Referential only – mirrors the Supabase schema (Phase 3+)
// ============================================================

export type TipoDocumento =
  | 'CC'
  | 'CE'
  | 'NIT'
  | 'PASAPORTE';

export type TipoIngreso =
  | 'viabilidad'
  | 'documentos'
  | 'comision';

export type EstadoIngreso =
  | 'pendiente'
  | 'pagado';

export type EstadoOperacion =
  | 'viabilidad'
  | 'documentos'
  | 'banco'
  | 'aprobado'
  | 'rechazado';

// ------------------------------------------------------------
// Cliente
// ------------------------------------------------------------
export interface Cliente {
  id: string;
  nombre: string;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  telefono: string;
  email: string;
  direccion: string;
  empresa?: string;
  cargo?: string;
  estado?: EstadoOperacion; // Added for UI sync
  total_generado?: number;   // Added for UI sync
  created_at: string;
}

// ------------------------------------------------------------
// Ingreso (pago del cliente)
// ------------------------------------------------------------
export interface Ingreso {
  id: string;
  cliente_id: string;
  tipo: TipoIngreso;
  monto: number;
  estado: EstadoIngreso;
  fecha: string;
}

// ------------------------------------------------------------
// Operación (crédito hipotecario)
// ------------------------------------------------------------
export interface Operacion {
  id: string;
  cliente_id: string;
  banco: string;
  monto_credito: number;
  estado: EstadoOperacion;
}

// ------------------------------------------------------------
// Documento
// ------------------------------------------------------------
export interface Documento {
  id: string;
  cliente_id: string;
  tipo_documento: string;
  url_archivo: string;
  subido_por: string;
  created_at: string;
}
