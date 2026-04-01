'use client';

import DashboardHeader from '@/components/layout/DashboardHeader';
import { Briefcase, Construction, Rocket } from 'lucide-react';

export default function OperacionesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardHeader 
        title="Operaciones Hipotecarias" 
        subtitle="Seguimiento detallado de trámites ante entidades bancarias."
      />

      <div className="bg-white rounded-[40px] border border-gray-100 p-20 shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-[32px] bg-amber-50 flex items-center justify-center text-[#D4A017] mb-8 mx-auto shadow-xl shadow-amber-100/50">
            <Briefcase className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-[#0F0A4D] mb-4">Módulo en Construcción</h2>
          <p className="text-gray-400 font-medium mb-10 leading-relaxed">
            Estamos trabajando para brindarte el mejor panel de gestión de operaciones bancarias. Muy pronto podrás ver el estado de todos tus créditos en tiempo real.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#0F0A4D] text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-900/20">
            <Rocket className="w-4 h-4 text-[#D4A017]" />
            Próximamente: Fase 7.2
          </div>
        </div>
      </div>
    </div>
  );
}
