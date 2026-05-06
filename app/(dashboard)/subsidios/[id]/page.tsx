'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { ArrowLeft, Plus, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SubsidioService } from '@/services/subsidio.service';
import type { Subsidio, AbonoSubsidio } from '@/types';
import UIModal from '@/components/ui/UIModal';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const formatCurrency = (n: number = 0) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export default function SubsidioDetailPage() {
  const { id } = useParams() as { id: string };
  const [subsidio, setSubsidio] = useState<Subsidio | null>(null);
  const [abonos, setAbonos] = useState<AbonoSubsidio[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // Abono form state
  const [formMonto, setFormMonto] = useState('');
  const [formFecha, setFormFecha] = useState(new Date().toISOString().split('T')[0]);
  const [formObservacion, setFormObservacion] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await SubsidioService.getById(id);
    setSubsidio(result.subsidio);
    setAbonos(result.abonos);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleAddAbono = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMonto) return;
    setSaving(true);
    await SubsidioService.addAbono({
      subsidio_id: id,
      monto: parseFloat(formMonto),
      fecha: formFecha,
      observacion: formObservacion.toUpperCase(),
    });
    setSaving(false);
    setOpenModal(false);
    setFormMonto('');
    setFormFecha(new Date().toISOString().split('T')[0]);
    setFormObservacion('');
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4A017] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!subsidio) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Subsidio no encontrado.</p>
        <Link href="/operaciones" className="text-[#D4A017] font-bold mt-4 inline-block">← Volver a Subsidios</Link>
      </div>
    );
  }

  const progress = subsidio.valor_total > 0
    ? Math.min(100, Math.round(((subsidio.total_abonos || 0) / subsidio.valor_total) * 100))
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DashboardHeader
        title={`Subsidio — ${subsidio.cliente_nombre?.toUpperCase() || 'CLIENTE'}`}
        description={subsidio.descripcion?.toUpperCase() || 'Detalle del subsidio y registro de aportes.'}
      />

      {/* Back link */}
      <Link href="/operaciones" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#D4A017] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a Subsidios
      </Link>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-3 sm:p-8 shadow-sm">
          <p className="text-[7px] sm:text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 sm:mb-2">Cédula</p>
          <p className="text-[10px] sm:text-[13px] md:text-2xl font-black text-[#0B1E3F] tracking-tighter truncate">{subsidio.cliente_cedula}</p>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-3 sm:p-8 shadow-sm">
          <p className="text-[7px] sm:text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 sm:mb-2 leading-tight">Valor Total</p>
          <p className="text-[10px] sm:text-[13px] md:text-2xl font-black text-[#D4A017] tracking-tighter truncate">{formatCurrency(subsidio.valor_total)}</p>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-3 sm:p-8 shadow-sm">
          <p className="text-[7px] sm:text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 sm:mb-2">Pendiente</p>
          <p className={`text-[10px] sm:text-[13px] md:text-2xl font-black tracking-tighter truncate ${(subsidio.pendiente || 0) > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {formatCurrency(subsidio.pendiente)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-[#0B1E3F]">Progreso de Abonos</p>
          <span className="text-sm font-black text-[#D4A017]">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-[#D4A017] to-amber-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-gray-400">
          Abonado: <span className="font-bold text-emerald-500">{formatCurrency(subsidio.total_abonos)}</span> de {formatCurrency(subsidio.valor_total)}
        </p>
      </div>

      {/* Abonos list */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-[#0B1E3F]">Historial de Aportes</h3>
          <Button
            onClick={() => setOpenModal(true)}
            className="h-12 bg-[#D4A017] hover:bg-[#B8860B] text-white rounded-2xl font-black px-6 flex items-center gap-2 border-none shadow-lg shadow-amber-100"
          >
            <Plus className="w-4 h-4" />
            Registrar Aporte
          </Button>
        </div>

        {abonos.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="italic">Aún no hay aportes registrados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {abonos.map(ab => (
              <div key={ab.id} className="flex items-center justify-between p-5 rounded-3xl bg-[#F8F9FA]/50 border border-transparent hover:border-gray-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 font-black text-xl">
                    $
                  </div>
                  <div>
                    <p className="text-base font-black text-[#0B1E3F]">{formatCurrency(ab.monto)}</p>
                    <p className="text-xs text-gray-400 font-medium">{new Date(ab.fecha + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                {ab.observacion && (
                  <p className="text-sm text-gray-400 italic max-w-xs text-right uppercase">{ab.observacion}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Abono Modal */}
      <UIModal isOpen={openModal} onClose={() => setOpenModal(false)} title="Registrar Aporte">
        <form onSubmit={handleAddAbono} className="space-y-6 p-1">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Monto del Aporte</label>
            <input
              type="number"
              value={formMonto}
              onChange={e => setFormMonto(e.target.value)}
              placeholder="Ej: 500000"
              required
              min={0}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#D4A017]/20 focus:border-[#D4A017] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Fecha del Aporte</label>
            <input
              type="date"
              value={formFecha}
              onChange={e => setFormFecha(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#D4A017]/20 focus:border-[#D4A017] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Observación (opcional)</label>
            <textarea
              value={formObservacion}
              onChange={e => setFormObservacion(e.target.value)}
              placeholder="Notas adicionales del aporte..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#D4A017]/20 focus:border-[#D4A017] outline-none transition-all resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={() => setOpenModal(false)} className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none">
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="bg-[#D4A017] hover:bg-[#B8860B] text-white border-none">
              {saving ? 'Guardando...' : 'Registrar Aporte'}
            </Button>
          </div>
        </form>
      </UIModal>
    </div>
  );
}
