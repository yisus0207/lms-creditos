'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { OperacionService, OperacionWithCliente } from '@/services/operacion.service';
import KanbanColumn from './KanbanColumn';
import type { EstadoOperacion } from '@/types';

const COLUMNS: { id: EstadoOperacion; title: string; color: string }[] = [
  { id: 'viabilidad', title: 'Viabilidad', color: 'bg-amber-500' },
  { id: 'documentos', title: 'Documentación', color: 'bg-[#0B1E3F]' },
  { id: 'banco', title: 'En Banco', color: 'bg-emerald-500' },
  { id: 'aprobado', title: 'Aprobado', color: 'bg-purple-600' },
];

export default function KanbanBoard() {
  const [operations, setOperations] = useState<OperacionWithCliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    setLoading(true);
    const data = await OperacionService.getAllWithClientes();
    setOperations(data);
    setLoading(false);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic Update
    const newStatus = destination.droppableId as EstadoOperacion;
    const updatedOps = [...operations];
    const opIndex = updatedOps.findIndex(op => op.id === draggableId);
    
    if (opIndex !== -1) {
      const movedOp = { ...updatedOps[opIndex], estado: newStatus };
      updatedOps[opIndex] = movedOp;
      setOperations(updatedOps);

      // Persist to Server
      const success = await OperacionService.updateEstado(draggableId, newStatus);
      if (!success) {
        // Rollback on failure
        fetchOperations();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex gap-8 overflow-x-auto pb-8 min-h-[600px] animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 min-w-[320px] bg-gray-50/50 rounded-[40px] h-full border border-dashed border-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-8 overflow-x-auto pb-8 min-h-[700px] scrollbar-hide">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            operations={operations.filter((op) => op.estado === col.id)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
