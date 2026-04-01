import React from 'react';
import { DollarSign, Wallet, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/utils';

interface IngresoSummaryProps {
  stats: {
    total: number;
    pagado: number;
    pendiente: number;
  };
}

export default function IngresoSummary({ stats }: IngresoSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Proyectado"
        value={formatCurrency(stats.total)}
        subtitle="Flujo de caja global"
        icon={<DollarSign className="w-6 h-6" />}
        trend="up"
      />
      <StatCard
        title="Cobros Efectivos"
        value={formatCurrency(stats.pagado)}
        subtitle="Capital ya en cuenta"
        icon={<DollarSign className="w-6 h-6" />}
        trend="up"
      />
      <StatCard
        title="Pendiente Cobro"
        value={formatCurrency(stats.pendiente)}
        subtitle="Gestión de cartera"
        icon={<Clock className="w-6 h-6" />}
        trend="neutral"
      />
    </div>
  );
}
