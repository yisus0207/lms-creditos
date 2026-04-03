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
  user_id?: string;            // Link to Supabase Auth
  banco?: string;
  monto_total_credito?: number; // For debt calculations
  estado?: EstadoOperacion; 
  total_generado?: number;   
  total_deuda?: number;
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

// ------------------------------------------------------------
// Subsidio
// ------------------------------------------------------------
export interface Subsidio {
  id: string;
  cliente_id: string;
  valor_total: number;
  descripcion?: string;
  created_at: string;
  // Virtual/joined fields
  cliente_nombre?: string;
  cliente_cedula?: string;
  total_abonos?: number;
  pendiente?: number;
}

// ------------------------------------------------------------
// Abono de Subsidio
// ------------------------------------------------------------
export interface AbonoSubsidio {
  id: string;
  subsidio_id: string;
  monto: number;
  fecha: string;
  observacion?: string;
  created_at: string;
}

