import React from 'react';
import Badge from '@/components/ui/Badge';
import { IngresoWithCliente } from '@/services/ingreso.service';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCompact, formatCurrency } from '@/lib/utils';

interface IngresoTableProps {
  ingresos: IngresoWithCliente[];
  onEdit?: (ingreso: IngresoWithCliente) => void;
  onDelete?: (ingreso: IngresoWithCliente) => void;
}

export default function IngresoTable({ ingresos, onEdit, onDelete }: IngresoTableProps) {
  const getTipoStyles = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'viabilidad': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'documentos': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'comision': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (!ingresos || ingresos.length === 0) {
    return (
      <div className="bg-white rounded-[32px] p-12 sm:p-20 border border-gray-100/50 shadow-sm text-center">
        <p className="text-gray-400 font-medium">No se encontraron registros de ingresos.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100/50 shadow-sm">

      {/* ============================================================
          VISTA MOBILE — Filas compactas (< sm)
          ============================================================ */}
      <div className="sm:hidden divide-y divide-gray-50">
        {ingresos.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-black text-[#0F0A4D] text-sm truncate uppercase">{item.cliente_nombre}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getTipoStyles(item.tipo)}`}>
                  {item.tipo}
                </span>
                <span className="text-[10px] text-gray-400">
                  {item ? new Date(item.fecha).toLocaleDateString('es-ES') : '—'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-black text-[#0F0A4D]">{formatCompact(item.monto)}</span>
                <Badge variant={item.estado === 'pagado' ? 'success' : 'error'} className="text-[9px]">
                  {item.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 ml-1">
                <button onClick={() => onEdit?.(item)} className="p-1.5 text-gray-300 hover:text-[#D4A017] transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDelete?.(item)} className="p-1.5 text-gray-300 hover:text-rose-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
          VISTA DESKTOP — Tabla completa (sm+)
          ============================================================ */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Monto</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right hidden md:table-cell">Fecha</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ingresos.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                <td className="px-8 py-5">
                  <span className="text-sm font-black text-[#0F0A4D] group-hover:text-[#D4A017] transition-colors uppercase">
                    {item.cliente_nombre}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${getTipoStyles(item.tipo)}`}>
                    {item.tipo}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <span className="text-sm font-black text-[#0F0A4D]">
                    {formatCurrency(item.monto)}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <Badge variant={item.estado === 'pagado' ? 'success' : 'error'} className="font-black text-[10px] uppercase tracking-wider min-w-[90px]">
                    {item.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                  </Badge>
                </td>
                <td className="px-8 py-5 text-right hidden md:table-cell">
                  <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
                    {item ? new Date(item.fecha).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit?.(item)}
                      className="p-2 text-gray-400 hover:text-[#D4A017] hover:bg-amber-50 rounded-xl transition-all shadow-sm active:scale-95"
                      title="Editar registro"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(item)}
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm active:scale-95"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
