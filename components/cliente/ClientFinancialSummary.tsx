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
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      {/* 1. Valor del Crédito */}
      <Card hasAccent className="col-span-2 md:col-span-1 !bg-white shadow-md hover:!translate-y-0 overflow-hidden relative group !p-3 sm:!p-5 border border-gray-100">
        <div className="absolute top-0 right-0 w-20 h-20 bg-navy-50 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex gap-2 items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0F0A4D] rounded-lg flex items-center justify-center text-[#D4A017] shadow-sm shrink-0">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider text-gray-400 mb-0.5 sm:mb-1">Valor Total del Crédito</p>
            <p className="text-base sm:text-xl font-black text-[#0F0A4D] tracking-tight truncate">{formatCurrency(montoTotal)}</p>
          </div>
        </div>
      </Card>

      {/* 2. Total Abonado */}
      <Card hasAccent className="col-span-1 !bg-[#0F0A4D] shadow-md hover:!translate-y-0 text-white group overflow-hidden relative !p-3 sm:!p-5">
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full translate-x-1/4 translate-y-1/4 blur-xl" />
        <div className="relative z-10 flex flex-col gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-md flex items-center justify-center text-emerald-400 border border-emerald-500/30 shrink-0">
               <TrendingUp className="w-3 h-3 sm:w-5 sm:h-5" />
             </div>
             <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider text-[#D4A017] leading-tight">Total<br/>Abonado</p>
          </div>
          <div>
            <p className="text-sm sm:text-lg font-black tracking-tight truncate">{formatCurrency(totalPagado)}</p>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-0.5">
             <div 
               className="h-full bg-emerald-400 rounded-full" 
               style={{ width: `${porcentajePagado}%` }} 
             />
          </div>
          <p className="text-[6px] sm:text-[8px] font-bold text-white/40 uppercase tracking-widest leading-none">
            {porcentajePagado.toFixed(1)}%
          </p>
        </div>
      </Card>

      {/* 3. Saldo Pendiente */}
      <Card hasAccent className="col-span-1 !bg-white shadow-md hover:!translate-y-0 group border border-amber-100 relative !p-3 sm:!p-5">
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-full translate-x-1/2 -translate-y-1/2 blur-xl" />
        <div className="relative z-10 flex flex-col gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 sm:w-10 sm:h-10 bg-amber-50 rounded-md flex items-center justify-center text-[#D4A017] border border-amber-200 shrink-0">
               <Receipt className="w-3 h-3 sm:w-5 sm:h-5" />
             </div>
             <p className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider text-gray-400 leading-tight">Saldo<br/>Pendiente</p>
          </div>
          <div>
            <p className="text-sm sm:text-lg font-black text-amber-700 tracking-tight truncate">{formatCurrency(deuda)}</p>
          </div>
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 rounded-full w-fit">
             <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse shrink-0" />
             <span className="text-[5px] sm:text-[7px] font-black text-amber-700 uppercase tracking-wider leading-none">En Trámite</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
