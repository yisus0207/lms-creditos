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
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const MONTHS_FULL = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

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

        const monthlyMap: Record<number, number> = {};
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          monthlyMap[d.getMonth()] = 0;
        }

        ingresos.forEach(i => {
          const d = new Date(i.fecha);
          if (monthlyMap[d.getMonth()] !== undefined) {
            monthlyMap[d.getMonth()] += i.monto;
          }
        });

        const trendData = Object.entries(monthlyMap).map(([month, amount]) => ({
          name: MONTHS_FULL[parseInt(month)].substring(0, 3),
          recaudo: amount,
        }));
        
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Historial mensual (6 meses)</p>
              </div>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-[#D4A017] animate-pulse" />
                <span className="text-[10px] font-black text-[#0F0A4D] uppercase">En vivo</span>
              </div>
            </div>
            
            <div className="h-[350px] w-full pr-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="colorRecaudo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4A017" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4A017" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 900 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                    tickFormatter={(value) => `$${value/1000}k`}
                    width={40}
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
                    formatter={(value: any) => [formatCurrency(value), 'Recaudado']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="recaudo" 
                    stroke="#D4A017" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRecaudo)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
