// ============================================================
// LMS Créditos – App-wide constants
// ============================================================

export const APP_NAME = 'LMS Créditos';
export const APP_DESCRIPTION =
  'Plataforma de gestión de créditos hipotecarios';

export const BRAND = {
  navy: '#0F0A4D',
  gold: '#D4A017',
} as const;

export const TIPO_INGRESO_LABELS: Record<string, string> = {
  viabilidad: 'Estudio de Viabilidad',
  documentos: 'Gestión Documental',
  comision: 'Comisión de Éxito',
};

export const ESTADO_OPERACION_LABELS: Record<string, string> = {
  viabilidad: 'Viabilidad',
  documentos: 'Documentos',
  banco: 'En Banco',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

export const NAV_LINKS_PUBLIC = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/contacto', label: 'Contacto' },
] as const;

export const NAV_LINKS_DASHBOARD = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/clientes', label: 'Clientes', icon: 'Users' },
  { href: '/ingresos', label: 'Ingresos', icon: 'DollarSign' },
  { href: '/documentos', label: 'Documentos', icon: 'FileText' },
  { href: '/operaciones', label: 'Operaciones', icon: 'Briefcase' },
] as const;

export const PORTAL_BASE = '/portal';
