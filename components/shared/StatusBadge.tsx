import Badge from '@/components/ui/Badge';
import type { EstadoOperacion, EstadoIngreso } from '@/types';

type Status = EstadoOperacion | EstadoIngreso;

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  // Operación states
  viabilidad: { label: 'Viabilidad', variant: 'info' },
  documentos: { label: 'Documentos', variant: 'warning' },
  banco: { label: 'En Banco', variant: 'info' },
  aprobado: { label: 'Aprobado', variant: 'success' },
  rechazado: { label: 'Rechazado', variant: 'danger' },
  // Ingreso states
  pendiente: { label: 'Pendiente', variant: 'warning' },
  pagado: { label: 'Pagado', variant: 'success' },
};

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusMap[status] ?? { label: status, variant: 'default' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
