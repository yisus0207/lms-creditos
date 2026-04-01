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
  });
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

        // KPI Stats
        setStats({
          totalClientes: clientes.length,
          ingresosTotales: summary.total,
          ingresosPendientes: summary.pendiente,
          creditosAprobados: clientes.filter(c => c.estado === 'aprobado').length,
        });

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

        // Status Distribution (Chart 2)
        const statusMap = clientes.reduce((acc: any, curr) => {
          const status = curr.estado || 'viabilidad';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

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
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-[#D4A017]" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-[#0F0A4D] focus:ring-0 cursor-pointer"
            >
              {MONTHS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(stats.ingresosTotales)}
          subtitle="Recaudado este mes"
          icon={<DollarSign className="w-6 h-6" />}
          trend="up"
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
          subtitle="Sincronizados"
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

      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Income Chart */}
        <Card hasAccent padding="lg">
          <h3 className="text-xl font-black text-[#0F0A4D] mb-8 flex items-center gap-3">
            <div className="p-2 bg-[#D4A017]/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-[#D4A017]" />
            </div>
            Ingresos por Tipo
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
                <div className="flex items-center justify-center h-full text-xs text-gray-400 font-bold uppercase tracking-widest italic">Cargando métricas...</div>
              )}
            </ResponsiveContainer>
          </div>
        </Card>
 
        {/* Status Donut Chart */}
        <Card padding="lg">
          <h3 className="text-xl font-black text-[#0F0A4D] mb-8 flex items-center gap-3">
            <div className="p-2 bg-[#D4A017]/10 rounded-lg">
              <PieChartIcon className="w-5 h-5 text-[#D4A017]" />
            </div>
            Distribución de Cartera
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {statusData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`${value}%`, 'Porcentaje']}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                    formatter={(value, entry: any) => (
                      <span className="text-xs font-black text-[#0F0A4D] uppercase tracking-wider ml-2">{value}</span>
                    )}
                  />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400 font-bold uppercase tracking-widest italic">Sincronizando estados...</div>
              )}
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
