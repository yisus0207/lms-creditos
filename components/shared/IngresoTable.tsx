import React from 'react';
import Badge from '@/components/ui/Badge';
import { IngresoWithCliente } from '@/services/ingreso.service';
import { Pencil, Trash2 } from 'lucide-react';

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
      <div className="bg-white rounded-[32px] p-20 border border-gray-100/50 shadow-sm text-center">
        <p className="text-gray-400 font-medium">No se encontraron registros de ingresos.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100/50 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Monto</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Fecha</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ingresos.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                <td className="px-10 py-6">
                  <span className="text-sm font-black text-[#0F0A4D] group-hover:text-[#D4A017] transition-colors">
                    {item.cliente_nombre}
                  </span>
                </td>
                <td className="px-10 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${getTipoStyles(item.tipo)}`}>
                    {item.tipo}
                  </span>
                </td>
                <td className="px-10 py-6 text-right">
                  <span className="text-sm font-black text-[#0F0A4D]">
                    ${item.monto.toLocaleString()}
                  </span>
                </td>
                <td className="px-10 py-6 text-center">
                  <Badge variant={item.estado === 'pagado' ? 'success' : 'error'} className="font-black text-[10px] uppercase tracking-wider min-w-[100px]">
                    {item.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                  </Badge>
                </td>
                <td className="px-10 py-6 text-right">
                  <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
                    {item ? new Date(item.fecha).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center justify-end gap-3 transition-all duration-300">
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
