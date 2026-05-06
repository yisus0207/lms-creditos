'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IngresoService } from '@/services/ingreso.service';
import { ClienteService } from '@/services/cliente.service';
import { SubsidioService } from '@/services/subsidio.service';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/utils';
import { 
  Users, 
  DollarSign, 
  Wallet, 
  FileCheck, 
  TrendingUp, 
  Gem
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const MONTHS_FULL = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function formatCompactCOP(value: number) {
  if (!Number.isFinite(value)) return '$0';
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${Math.round(value / 1_000)}k`;
  return `$${Math.round(value)}`;
}

function RecaudoValueLabel(props: any) {
  const { x, y, value } = props;
  if (value == null) return null;
  return (
    <text
      x={x}
      y={y}
      dy={-12}
      textAnchor="middle"
      fill="#0F0A4D"
      fontSize={10}
      fontWeight={900}
      style={{ pointerEvents: 'none' }}
    >
      {formatCurrency(Number(value))}
    </text>
  );
}

function RecaudoBarLabel(props: any) {
  const { x, y, width, height, value } = props;
  if (value == null) return null;
  const labelX = (x ?? 0) + (width ?? 0) + 10;
  const labelY = (y ?? 0) + (height ?? 0) / 2 + 4;

  return (
    <text
      x={labelX}
      y={labelY}
      textAnchor="start"
      fill="#0F0A4D"
      fontSize={10}
      fontWeight={900}
      style={{ pointerEvents: 'none' }}
    >
      {formatCurrency(Number(value))}
    </text>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalClientes: 0,
    ingresosTotales: 0,
    ingresosPendientes: 0,
    creditosAprobados: 0,
    totalSubsidios: 0,
    tendencias: {
      ingresos: 0,
      clientes: 0,
    }
  });
  
  const [monthlyTrendData, setMonthlyTrendData] = useState<any[]>([]);

  useEffect(() => {
    async function loadAllStats() {
      setLoading(true);
      try {
        const [clientes, summary, ingresos, subsidioSummary] = await Promise.all([
          ClienteService.getClientes(),
          IngresoService.getSummary(),
          IngresoService.getAll(),
          SubsidioService.getSummary()
        ]);

        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const prevMonthIngresos = ingresos.filter(i => {
           const d = new Date(i.fecha);
           return d >= firstDayPrevMonth && d < firstDayThisMonth;
        }).reduce((acc, curr) => acc + curr.monto, 0);

        const currentMonthIngresos = ingresos.filter(i => {
           const d = new Date(i.fecha);
           return d >= firstDayThisMonth;
        }).reduce((acc, curr) => acc + curr.monto, 0);

        const tendenciaIngresos = prevMonthIngresos > 0 
          ? Math.round(((currentMonthIngresos - prevMonthIngresos) / prevMonthIngresos) * 100) 
          : 0;

        setStats({
          totalClientes: clientes.length,
          ingresosTotales: summary.total,
          ingresosPendientes: summary.pendiente,
          creditosAprobados: clientes.filter(c => c.estado === 'aprobado').length,
          totalSubsidios: subsidioSummary.total,
          tendencias: {
            ingresos: tendenciaIngresos,
            clientes: Math.round((clientes.filter(c => new Date(c.created_at) >= firstDayThisMonth).length / (clientes.length || 1)) * 100)
          }
        });

        // Full current-year buckets (Jan..Dec) so future months (e.g., May) show up immediately.
        const currentYear = now.getFullYear();
        const yearBuckets = Array.from({ length: 12 }, (_, month) => ({
          name: MONTHS_FULL[month].substring(0, 3),
          recaudo: 0,
          month,
        }));

        ingresos.forEach(i => {
          const d = new Date(i.fecha);
          if (d.getFullYear() !== currentYear) return;
          const m = d.getMonth();
          if (yearBuckets[m]) yearBuckets[m].recaudo += i.monto;
        });

        const trendData = yearBuckets.map(({ name, recaudo }) => ({ name, recaudo }));
        
        setMonthlyTrendData(trendData);

      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllStats();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-10"
    >
      <DashboardHeader
        title="Centro de Control Financiero"
        description="Gestión premium de la cartera hipotecaria y métricas de rendimiento."
      />

      {/* KPI Cards Grid — 2 cols mobile, 3 cols tablet, 5 cols xl */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-6">
        <motion.div variants={itemVariants}>
          <StatCard
            title="Recaudado Total"
            value={formatCurrency(stats.ingresosTotales)}
            subtitle="Dinero ingresado"
            icon={<DollarSign className="w-6 h-6" />}
            trend={stats.tendencias.ingresos > 0 ? 'up' : 'neutral'}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="En Trámite (Deuda)"
            value={formatCurrency(stats.ingresosPendientes)}
            subtitle="Cuentas por cobrar"
            icon={<Wallet className="w-6 h-6" />}
            trend="neutral"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Subsidios"
            value={formatCurrency(stats.totalSubsidios)}
            subtitle="Monto proyectado"
            icon={<Gem className="w-6 h-6 text-[#D4A017]" />}
            trend="up"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Clientes"
            value={stats.totalClientes}
            subtitle={`+${stats.tendencias.clientes}% este mes`}
            icon={<Users className="w-6 h-6" />}
            trend="up"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Éxito"
            value={stats.creditosAprobados}
            subtitle="Créditos liquidados"
            icon={<FileCheck className="w-6 h-6" />}
            trend="up"
            loading={loading}
          />
        </motion.div>
      </div>

      {/* Main Chart Row */}
      <div className="grid grid-cols-1 gap-8">
        {/* Monthly Trend Chart */}
        <motion.div variants={itemVariants}>
          <Card className="min-h-[400px] overflow-hidden border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:bg-white/60">
            <div className="mb-10 flex items-center justify-between p-2">
              <div>
                <h3 className="text-xl font-black text-[#0F0A4D] flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[#D4A017]" />
                  Tendencia de Recaudos
                </h3>
                <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Historial mensual (12 meses)</p>
              </div>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-[#D4A017] animate-pulse" />
                <span className="text-[10px] font-black text-[#0F0A4D] uppercase">En vivo</span>
              </div>
            </div>
            
            <div className="h-[350px] w-full pr-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyTrendData}
                  layout="vertical"
                  margin={{ top: 8, right: 110, left: 12, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                    tickFormatter={(value) => formatCompactCOP(Number(value))}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 900 }}
                    width={44}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '20px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(10px)',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#0F0A4D', fontWeight: 900, fontSize: '12px' }}
                    labelStyle={{ color: '#D4A017', fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Recaudado']}
                    cursor={{ fill: 'rgba(212,160,23,0.06)' }}
                  />

                  <Bar
                    dataKey="recaudo"
                    fill="#D4A017"
                    radius={[14, 14, 14, 14]}
                    maxBarSize={38}
                    animationDuration={900}
                  >
                    <LabelList dataKey="recaudo" content={RecaudoBarLabel} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
