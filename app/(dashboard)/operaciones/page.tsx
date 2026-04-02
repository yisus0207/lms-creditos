'use client';

import React from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import KanbanBoard from '@/components/shared/KanbanBoard';
import { Search, Filter, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function OperacionesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DashboardHeader 
        title="Módulo de Operaciones" 
        subtitle="Gestión visual del flujo de créditos y pipeline de clientes."
      />

      {/* Kanban Filters & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4A017] transition-colors" />
            <input 
              type="text"
              placeholder="Buscar por cliente o banco..."
              className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl w-full md:w-80 text-sm font-medium focus:ring-4 focus:ring-[#D4A017]/5 focus:border-[#D4A017] outline-none transition-all shadow-sm"
            />
          </div>
          <Button className="h-[56px] bg-white hover:bg-gray-50 text-[#0B1E3F] border-gray-100 rounded-2xl font-black px-6 flex items-center gap-3">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#0B1E3F]/5 rounded-xl border border-[#0B1E3F]/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-[#0B1E3F] uppercase tracking-widest">Sincronización Live</span>
          </div>
          <Button className="h-[56px] bg-[#D4A017] hover:bg-[#B8860B] text-white rounded-2xl font-black px-8 flex items-center gap-3 border-none shadow-xl shadow-amber-100">
            <Plus className="w-5 h-5" />
            <span>Nueva Operación</span>
          </Button>
        </div>
      </div>

      {/* The Kanban Board */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none -z-10 rounded-[40px]" />
        <KanbanBoard />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-8 py-6 text-gray-400">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Fase 1: Viabilidad</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-[#0B1E3F]" />
          <span>Fase 2: Documentación</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Fase 3: Banco</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Fase 4: Aprobado</span>
        </div>
      </div>
    </div>
  );
}
