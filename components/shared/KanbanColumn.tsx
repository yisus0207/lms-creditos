import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import type { OperacionWithCliente } from '@/services/operacion.service';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  operations: OperacionWithCliente[];
  color: string;
}

export default function KanbanColumn({ id, title, operations, color }: KanbanColumnProps) {
  return (
    <div className="flex-1 flex flex-col min-w-[320px] max-w-[400px] h-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className={cn("w-3 h-3 rounded-full", color)} />
          <h4 className="text-sm font-black text-[#0B1E3F] uppercase tracking-[0.15em]">{title}</h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#0B1E3F]/5 text-[10px] font-black text-[#0B1E3F]">
          {operations.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-2 rounded-[32px] transition-colors duration-200 min-h-[400px]",
              snapshot.isDraggingOver ? "bg-[#0B1E3F]/5" : "bg-transparent"
            )}
          >
            {operations.map((op, index) => (
              <KanbanCard key={op.id} operation={op} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
