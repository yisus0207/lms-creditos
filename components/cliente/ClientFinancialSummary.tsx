'use client';

import { formatCurrency } from '@/lib/utils';
import { Wallet, CreditCard, Receipt, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';

interface ClientFinancialSummaryProps {
  montoTotal: number;
  totalPagado: number;
}

export default function ClientFinancialSummary({ 
  montoTotal, 
  totalPagado 
}: ClientFinancialSummaryProps) {
  const deuda = Math.max(0, montoTotal - totalPagado);
  const porcentajePagado = montoTotal > 0 ? (totalPagado / montoTotal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Valor del Crédito */}
      <Card hasAccent className="!bg-white shadow-xl shadow-gray-200/40 hover:!translate-y-0 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-navy-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="w-12 h-12 bg-[#0F0A4D] rounded-2xl flex items-center justify-center text-[#D4A017] shadow-lg">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Valor Total del Crédito</p>
            <p className="text-2xl font-black text-[#0F0A4D] tracking-tighter">{formatCurrency(montoTotal)}</p>
          </div>
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0F0A4D] w-full opacity-10" />
          </div>
        </div>
      </Card>

      {/* 2. Total Abonado */}
      <Card hasAccent className="!bg-[#0F0A4D] shadow-xl shadow-navy-900/20 hover:!translate-y-0 text-white group overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017] mb-1">Total Abonado</p>
            <p className="text-2xl font-black tracking-tighter">{formatCurrency(totalPagado)}</p>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000" 
               style={{ width: `${porcentajePagado}%` }} 
             />
          </div>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">
            {porcentajePagado.toFixed(1)}% de la inversión cubierto
          </p>
        </div>
      </Card>

      {/* 3. Saldo Pendiente */}
      <Card hasAccent className="!bg-white shadow-xl shadow-gray-200/40 hover:!translate-y-0 group border border-amber-100 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#D4A017] border border-amber-200 shadow-sm animate-floating">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Saldo Pendiente</p>
            <p className="text-2xl font-black text-amber-700 tracking-tighter">{formatCurrency(deuda)}</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full w-fit">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
             <span className="text-[8px] font-black text-amber-700 uppercase tracking-widest">En Proceso de Trámite</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
