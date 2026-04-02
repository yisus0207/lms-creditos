'use client';

import { useState, useEffect } from 'react';
import { IngresoService } from '@/services/ingreso.service';
import { ClienteService } from '@/services/cliente.service';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/utils';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users, 
  DollarSign, 
  Wallet, 
  FileCheck, 
  Calendar,
  Briefcase
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import Select from '@/components/ui/Select';
import ProcessFunnel from '@/components/shared/ProcessFunnel';
import RecentActivityList from '@/components/shared/RecentActivityList';

const MONTHS = [
  { id: '0', label: 'Todos los registros' },
  { id: '1', label: 'Enero' },
  { id: '2', label: 'Febrero' },
  { id: '3', label: 'Marzo' },
  { id: '4', label: 'Abril' },
  { id: '5', label: 'Mayo' },
];

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState('0');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalClientes: 0,
    ingresosTotales: 0,
    ingresosPendientes: 0,
    creditosAprobados: 0,
    tendencias: {
      ingresos: 0,
      clientes: 0,
    }
  });
  const [funnelData, setFunnelData] = useState({
    viabilidad: 0,
    documentos: 0,
    banco: 0,
    aprobado: 0,
    rechazado: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);

  useEffect(() => {
    async function loadAllStats() {
      setLoading(true);
      try {
        const [clientes, summary, ingresos] = await Promise.all([
          ClienteService.getClientes(),
          IngresoService.getSummary(),
          IngresoService.getAll()
        ]);

        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Previous month stats for trends
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

        // KPI Stats
        setStats({
          totalClientes: clientes.length,
          ingresosTotales: summary.total,
          ingresosPendientes: summary.pendiente,
          creditosAprobados: clientes.filter(c => c.estado === 'aprobado').length,
          tendencias: {
            ingresos: tendenciaIngresos,
            clientes: Math.round((clientes.filter(c => new Date(c.created_at) >= firstDayThisMonth).length / (clientes.length || 1)) * 100)
          }
        });

        // Funnel Distribution
        const statusMap = clientes.reduce((acc: any, curr) => {
          const status = curr.estado || 'viabilidad';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, { viabilidad: 0, documentos: 0, banco: 0, aprobado: 0, rechazado: 0 });

        setFunnelData(statusMap);

        // Activity Feed Synthesis
        const latestClients = clientes.slice(0, 3).map(c => ({
          id: `c-${c.id}`,
          type: 'cliente',
          title: 'Nuevo Cliente',
          description: `${c.nombre} ha iniciado el proceso.`,
          timestamp: 'Reciente'
        }));

        const latestIngresos = ingresos.slice(0, 3).map(i => ({
          id: `i-${i.id}`,
          type: 'pago',
          title: 'Recaudo Registrado',
          description: `Abono de ${formatCurrency(i.monto)} por ${i.cliente_nombre}`,
          timestamp: 'Hoy'
        }));

        const statusUpdates = clientes
          .filter(c => c.estado !== 'viabilidad')
          .slice(0, 2)
          .map(c => ({
            id: `s-${c.id}`,
            type: 'estado',
            title: 'Progreso de Crédito',
            description: `${c.nombre} pasó a etapa ${c.estado?.toUpperCase()}`,
            timestamp: 'Ayer'
          }));

        setActivities([...latestIngresos, ...latestClients, ...statusUpdates].slice(0, 6));

        // Income by Type (Chart 1)
        const typeMap = ingresos.reduce((acc: any, curr) => {
          const type = curr.tipo || 'otros';
          acc[type] = (acc[type] || 0) + curr.monto;
          return acc;
        }, {});
        
        setIncomeData(Object.entries(typeMap).map(([name, value]) => ({ 
          name: name.charAt(0).toUpperCase() + name.slice(1), 
          value 
        })));

        // Donut Data
        const colors: any = { 
          viabilidad: '#D4A017', 
          documentos: '#0F0A4D', 
          banco: '#00D166', 
          aprobado: '#8B5CF6',
          rechazado: '#EF4444'
        };

        const total = clientes.length || 1;
        setStatusData(Object.entries(statusMap).map(([name, count]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: Math.round(((count as number) / total) * 100),
          color: colors[name] || '#CBD5E1'
        })));

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

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <DashboardHeader
        title="Dashboard"
        description="Resumen general del sistema y métricas clave en tiempo real."
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[#0F0A4D]/40">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0F0A4D]/40">Período:</span>
            </div>
            <Select
              className="min-w-[180px]"
              options={MONTHS}
              value={selectedMonth}
              onChange={setSelectedMonth}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(stats.ingresosTotales)}
          subtitle="Recaudado acumulado"
          icon={<DollarSign className="w-6 h-6" />}
          trend={stats.tendencias.ingresos > 0 ? 'up' : 'neutral'}
          loading={loading}
        />
        <StatCard
          title="Pendientes"
          value={formatCurrency(stats.ingresosPendientes)}
          subtitle="Cobros por gestionar"
          icon={<Wallet className="w-6 h-6" />}
          trend="neutral"
          loading={loading}
        />
        <StatCard
          title="Clientes Activos"
          value={stats.totalClientes}
          subtitle={`+${stats.tendencias.clientes}% este mes`}
          icon={<Users className="w-6 h-6" />}
          trend="up"
          loading={loading}
        />
        <StatCard
          title="Créditos Aprobados"
          value={stats.creditosAprobados}
          subtitle="Éxito acumulado"
          icon={<FileCheck className="w-6 h-6" />}
          trend="up"
          loading={loading}
        />
      </div>

      {/* Funnel Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#D4A017] rounded-full" />
             <h2 className="text-xl font-black text-[#0F0A4D] uppercase tracking-wider">Flujo de Operación</h2>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Cierre de mes: 28 días</p>
        </div>
        <ProcessFunnel data={funnelData} />
      </section>

      {/* Main Insights Grid */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Income Chart */}
        <div className="lg:col-span-2">
          <Card hasAccent padding="lg" className="h-full">
            <h3 className="text-xl font-black text-[#0F0A4D] mb-8 flex items-center gap-3">
              <div className="p-2 bg-[#D4A017]/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-[#D4A017]" />
              </div>
              Análisis Portafolio de Ingresos
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {incomeData.length > 0 ? (
                  <BarChart data={incomeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                      tickFormatter={(value) => formatCurrency(value)}
                      width={80}
                    />
                    <RechartsTooltip
                      cursor={{ fill: '#F8FAFC' }}
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                      formatter={(value: any) => [formatCurrency(value), 'Monto']}
                    />
                    <Bar
                      dataKey="value"
                      fill="#D4A017"
                      radius={[12, 12, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400 font-bold uppercase tracking-widest italic">Generando reportes financieros...</div>
                )}
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card padding="lg" className="h-full">
          <h3 className="text-xl font-black text-[#0F0A4D] mb-8 flex items-center gap-3">
            <div className="p-2 bg-[#D4A017]/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-[#D4A017]" />
            </div>
            Actividad Reciente
          </h3>
          <RecentActivityList activities={activities} loading={loading} />
        </Card>
      </div>

      {/* Distribution Donut (Secondary) */}
      <section className="animate-reveal-up" style={{ animationDelay: '0.8s' }}>
        <Card padding="lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-black text-[#0F0A4D] mb-2 flex items-center gap-3">
                Distribución Estratégica
              </h3>
              <p className="text-sm text-gray-400 font-medium mb-6">Perspectiva porcentual de la madurez de la cartera actual.</p>
              <div className="grid grid-cols-2 gap-4">
                 {statusData.map((s, i) => (
                   <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[10px] font-black text-[#0F0A4D] uppercase tracking-wider">{s.name}: {s.value}%</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="h-[200px] w-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
