import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Eye, User, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { OperacionWithCliente } from '@/services/operacion.service';

interface KanbanCardProps {
  operation: OperacionWithCliente;
  index: number;
}

export default function KanbanCard({ operation, index }: KanbanCardProps) {
  const { cliente } = operation;

  return (
    <Draggable draggableId={operation.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm transition-all duration-200 select-none",
            snapshot.isDragging ? "shadow-2xl scale-105 border-[#D4A017] z-50 ring-2 ring-[#D4A017]/10" : "hover:border-gray-200 hover:shadow-md"
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1E3F]/5 flex items-center justify-center text-[#0B1E3F]">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h5 className="text-[13px] font-black text-[#0B1E3F] truncate uppercase tracking-tight">
                  {cliente.nombre}
                </h5>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {cliente.tipo_documento} {cliente.numero_documento}
                </p>
              </div>
            </div>
            <Link 
              href={`/clientes/${cliente.id}`}
              className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-[#D4A017] hover:bg-amber-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{cliente.telefono}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium truncate">{cliente.email}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-black text-[#0B1E3F] uppercase tracking-widest">Activo</span>
            </div>
            <p className="text-[10px] font-black text-[#D4A017] uppercase bg-amber-50 px-2 py-0.5 rounded-full">
              {operation.banco || 'BANCO'}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
}
