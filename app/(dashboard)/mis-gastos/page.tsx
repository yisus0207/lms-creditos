'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/layout/DashboardHeader';
import Card from '@/components/ui/Card';
import UIModal from '@/components/ui/UIModal';
import { formatCurrency } from '@/lib/utils';
import { GASTO_CATEGORIAS } from '@/constants';
import { GastoService } from '@/services/gasto.service';
import { IngresoService } from '@/services/ingreso.service';
import type { Gasto } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from 'recharts';
import { Receipt, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';

const MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

/** Etiquetas tipo Feb-2025 (mes-año en inglés corto) */
const MONTHS_EN_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

function defaultMesAnio(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function mesAnioOptions(): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const d = new Date();
  d.setFullYear(d.getFullYear() - 4);
  d.setDate(1);
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);
  end.setMonth(11, 1);
  while (d <= end) {
    const y = d.getFullYear();
    const m = d.getMonth();
    out.push({
      value: `${y}-${String(m + 1).padStart(2, '0')}`,
      label: `${MONTHS_EN_SHORT[m]}-${y}`,
    });
    d.setMonth(d.getMonth() + 1);
  }
  return out.reverse();
}

/** Muestra Feb-2025 a partir de una fecha guardada como primer día del mes */
function formatGastoMesAnioLabel(isoDate: string) {
  const d = new Date(isoDate);
  return `${MONTHS_EN_SHORT[d.getMonth()]}-${d.getFullYear()}`;
}

function formatCompactCOP(value: number) {
  if (!Number.isFinite(value)) return '$0';
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${Math.round(value / 1_000)}k`;
  return `$${Math.round(value)}`;
}

function BarEndLabel({ fill }: { fill: string }) {
  return function Label(props: any) {
    const { x, y, width, height, value } = props;
    if (value == null || Number(value) === 0) return null;
    const labelX = (x ?? 0) + (width ?? 0) + 8;
    const labelY = (y ?? 0) + (height ?? 0) / 2 + 4;
    return (
      <text
        x={labelX}
        y={labelY}
        textAnchor="start"
        fill={fill}
        fontSize={9}
        fontWeight={800}
        style={{ pointerEvents: 'none' }}
      >
        {formatCurrency(Number(value))}
      </text>
    );
  };
}

function buildMergedChart(
  year: number,
  ingresos: Awaited<ReturnType<typeof IngresoService.getAll>>,
  gastosList: Gasto[]
) {
  const buckets = Array.from({ length: 12 }, (_, m) => ({
    name: MONTHS_SHORT[m],
    month: m,
    ingresos: 0,
    gastos: 0,
  }));

  ingresos.forEach((i) => {
    const d = new Date(i.fecha);
    if (d.getFullYear() !== year) return;
    if (i.estado === 'pagado') {
      buckets[d.getMonth()].ingresos += i.monto;
    }
  });

  gastosList.forEach((g) => {
    const d = new Date(g.fecha);
    if (d.getFullYear() !== year) return;
    buckets[d.getMonth()].gastos += g.monto;
  });

  return buckets;
}

export default function MisGastosPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [mergedChart, setMergedChart] = useState<
    { name: string; month: number; ingresos: number; gastos: number }[]
  >([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [categoria, setCategoria] = useState<string>(GASTO_CATEGORIAS[0]);
  const [otroDetalle, setOtroDetalle] = useState('');
  const [monto, setMonto] = useState('');
  /** YYYY-MM → se guarda en BD como YYYY-MM-01 */
  const [mesAnio, setMesAnio] = useState(defaultMesAnio);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const opcionesMesAnio = useMemo(() => mesAnioOptions(), []);

  const currentYear = new Date().getFullYear();

  const loadAll = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [gastosData, ingresosData] = await Promise.all([
        GastoService.getAll(),
        IngresoService.getAll(),
      ]);
      setGastos(gastosData);
      setMergedChart(buildMergedChart(currentYear, ingresosData, gastosData));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al cargar datos';
      setErrorMsg(
        `${msg}. Si falta la tabla, ejecuta sql/create_gastos.sql en Supabase.`
      );
      setGastos([]);
      try {
        const ingresosData = await IngresoService.getAll();
        setMergedChart(buildMergedChart(currentYear, ingresosData, []));
      } catch {
        setMergedChart(buildMergedChart(currentYear, [], []));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadAll();
  }, []);

  const totals = useMemo(() => {
    const ing = mergedChart.reduce((a, b) => a + b.ingresos, 0);
    const gas = mergedChart.reduce((a, b) => a + b.gastos, 0);
    return { ingresosYtd: ing, gastosYtd: gas, balance: ing - gas };
  }, [mergedChart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const m = parseFloat(monto.replace(',', '.'));
    if (!Number.isFinite(m) || m <= 0) {
      setErrorMsg('Ingresa un monto válido mayor a 0.');
      return;
    }
    if (categoria === 'otro' && !otroDetalle.trim()) {
      setErrorMsg('Describe el gasto cuando eliges "Otro".');
      return;
    }

    const categoriaFinal =
      categoria === 'otro' ? `Otro: ${otroDetalle.trim()}` : categoria;

    const fechaPrimerDia = `${mesAnio}-01`;

    setSaving(true);
    try {
      await GastoService.create({
        categoria: categoriaFinal,
        monto: m,
        fecha: fechaPrimerDia,
      });
      setMonto('');
      setOtroDetalle('');
      setMesAnio(defaultMesAnio());
      setModalOpen(false);
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar';
      setErrorMsg(`${msg}. ¿Existe la tabla gastos en Supabase?`);
    } finally {
      setSaving(false);
    }
  };

  const openModal = () => {
    setErrorMsg(null);
    setMesAnio(defaultMesAnio());
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrorMsg(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este gasto?')) return;
    await GastoService.delete(id);
    await loadAll();
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <DashboardHeader
        title="Mis gastos"
        description="Gastos del hogar y comparación con ingresos cobrados por mes (año actual)."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border border-emerald-100 bg-emerald-50/40">
          <div className="flex items-center gap-2 text-emerald-800 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Ingresos {currentYear} (pagado)
            </span>
          </div>
          <p className="text-2xl font-black text-[#0F0A4D]">
            {loading ? '…' : formatCurrency(totals.ingresosYtd)}
          </p>
        </Card>
        <Card className="p-5 border border-rose-100 bg-rose-50/40">
          <div className="flex items-center gap-2 text-rose-800 mb-1">
            <TrendingDown className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Gastos {currentYear}
            </span>
          </div>
          <p className="text-2xl font-black text-[#0F0A4D]">
            {loading ? '…' : formatCurrency(totals.gastosYtd)}
          </p>
        </Card>
        <Card className="p-5 border border-[#D4A017]/30 bg-amber-50/30">
          <div className="flex items-center gap-2 text-[#0F0A4D]/70 mb-1">
            <Receipt className="w-4 h-4 text-[#D4A017]" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Balance (ing − gast)
            </span>
          </div>
          <p
            className={`text-2xl font-black ${
              totals.balance >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {loading ? '…' : formatCurrency(totals.balance)}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden border-white/20 bg-white/50 backdrop-blur-xl rounded-[32px] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-2 mb-4">
          <div>
            <h2 className="text-lg font-black text-[#0F0A4D] flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#D4A017]" />
              Comparación mensual
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Ingresos vs gastos. Usa <span className="font-bold">Agregar gasto</span> para registrar uno nuevo.
            </p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0F0A4D] to-[#1a2b56] px-7 py-3.5 text-sm font-black text-[#D4A017] shadow-[0_12px_28px_rgba(15,10,77,0.25)] hover:shadow-[0_14px_32px_rgba(15,10,77,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Agregar gasto
          </button>
        </div>

        <UIModal
          isOpen={modalOpen}
          onClose={closeModal}
          title="Nuevo gasto"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-gray-500 -mt-2 mb-2 leading-relaxed">
              El mes se guarda como el <span className="font-bold text-[#0F0A4D]">día 1</span> en la base de datos
              (ej. <span className="font-mono text-[11px]">2025-02-01</span> para Feb-2025).
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                  Categoría
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full rounded-[22px] border-0 bg-gray-50/90 px-5 py-3.5 text-sm font-bold text-[#0F0A4D] shadow-inner ring-1 ring-gray-200/80 focus:ring-2 focus:ring-[#D4A017]/40 focus:outline-none transition-shadow"
                >
                  {GASTO_CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="otro">Otro</option>
                </select>
              </div>
              {categoria === 'otro' && (
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                    Describe el gasto
                  </label>
                  <input
                    type="text"
                    value={otroDetalle}
                    onChange={(e) => setOtroDetalle(e.target.value)}
                    placeholder="Ej. Netflix, gimnasio…"
                    className="w-full rounded-[22px] border-0 bg-gray-50/90 px-5 py-3.5 text-sm font-bold text-[#0F0A4D] placeholder:text-gray-400 shadow-inner ring-1 ring-gray-200/80 focus:ring-2 focus:ring-[#D4A017]/40 focus:outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                  Monto
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="$ 0"
                  className="w-full rounded-[22px] border-0 bg-gray-50/90 px-5 py-3.5 text-sm font-bold text-[#0F0A4D] shadow-inner ring-1 ring-gray-200/80 focus:ring-2 focus:ring-[#D4A017]/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">
                  Mes y año
                </label>
                <select
                  value={mesAnio}
                  onChange={(e) => setMesAnio(e.target.value)}
                  className="w-full rounded-[22px] border-0 bg-gray-50/90 px-5 py-3.5 text-sm font-bold text-[#0F0A4D] shadow-inner ring-1 ring-gray-200/80 focus:ring-2 focus:ring-[#D4A017]/40 focus:outline-none"
                >
                  {opcionesMesAnio.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errorMsg && (
              <p className="text-sm font-bold text-rose-600 bg-rose-50/90 rounded-[20px] px-4 py-3 ring-1 ring-rose-100">
                {errorMsg}
              </p>
            )}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full px-6 py-3 text-sm font-black text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-gradient-to-r from-[#D4A017] to-[#e8b422] px-8 py-3 text-sm font-black text-[#0F0A4D] shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
              >
                {saving ? 'Guardando…' : 'Guardar gasto'}
              </button>
            </div>
          </form>
        </UIModal>

        <div className="h-[520px] w-full pr-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Ingresos vs gastos por mes · {currentYear}
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mergedChart}
              layout="vertical"
              margin={{ top: 8, right: 120, left: 8, bottom: 8 }}
              barGap={2}
              barCategoryGap="18%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#E2E8F0"
                strokeOpacity={0.5}
              />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                tickFormatter={(v) => formatCompactCOP(Number(v))}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 900 }}
                width={40}
              />
              <Legend
                wrapperStyle={{ paddingTop: 8 }}
                formatter={(value) =>
                  value === 'ingresos' ? 'Ingresos (cobrado)' : 'Gastos'
                }
              />
              <RechartsTooltip
                formatter={(value, name) => [
                  formatCurrency(Number(value ?? 0)),
                  name === 'ingresos' ? 'Ingresos' : 'Gastos',
                ] as [string, string]}
                labelFormatter={(label) => `${label} ${currentYear}`}
                contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontWeight: 800,
                }}
              />
              <Bar
                dataKey="ingresos"
                name="ingresos"
                fill="#22c55e"
                radius={[10, 10, 10, 10]}
                maxBarSize={22}
              >
                <LabelList dataKey="ingresos" content={BarEndLabel({ fill: '#15803d' })} />
              </Bar>
              <Bar
                dataKey="gastos"
                name="gastos"
                fill="#ef4444"
                radius={[10, 10, 10, 10]}
                maxBarSize={22}
              >
                <LabelList dataKey="gastos" content={BarEndLabel({ fill: '#b91c1c' })} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 border-white/20 bg-white/40 backdrop-blur-xl">
        <h3 className="text-sm font-black text-[#0F0A4D] uppercase tracking-widest mb-4">
          Últimos gastos
        </h3>
        {loading ? (
          <p className="text-gray-400 text-sm">Cargando…</p>
        ) : gastos.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay gastos registrados aún.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {gastos.slice(0, 50).map((g) => (
              <li
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <div>
                  <p className="font-black text-[#0F0A4D]">{g.categoria}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    {formatGastoMesAnioLabel(g.fecha)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-rose-600">
                    {formatCurrency(g.monto)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(g.id)}
                    className="p-2 rounded-xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </motion.div>
  );
}
