'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { Plus, Eye, Trash2, Search, TriangleAlert, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SubsidioService } from '@/services/subsidio.service';
import { ClienteService } from '@/services/cliente.service';
import type { Subsidio, Cliente } from '@/types';
import UIModal from '@/components/ui/UIModal';
import Link from 'next/link';

const formatCurrency = (n: number = 0) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color === 'text-[#D4A017]' ? 'bg-amber-50' : color === 'text-emerald-500' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <span className={`${color} text-xl font-black`}>{icon}</span>
        </div>
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">{label}</p>
      </div>
      <p className={`text-3xl font-black ${color} transition-all group-hover:scale-[1.02] origin-left`}>{value}</p>
    </div>
  );
}

// Custom delete confirm modal
function DeleteConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-[36px] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onCancel} className="absolute top-5 right-5 p-2 text-gray-300 hover:text-gray-600 transition-colors rounded-full">
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center mx-auto mb-6">
          <TriangleAlert className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-xl font-black text-[#0B1E3F] text-center mb-2">¿Eliminar subsidio?</h3>
        <p className="text-sm text-gray-400 text-center mb-8">
          Se eliminará el subsidio de <span className="font-bold text-[#0B1E3F]">{name}</span> junto con todos sus aportes. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubsidiosPage() {
  const [subsidios, setSubsidios] = useState<Subsidio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subsidio | null>(null);

  // Form state
  const [formClienteId, setFormClienteId] = useState('');
  const [formValor, setFormValor] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [subs, clts] = await Promise.all([
      SubsidioService.getAll(),
      ClienteService.getClientes(),
    ]);
    setSubsidios(subs);
    setClientes(clts);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClienteId || !formValor) return;
    setSaving(true);
    await SubsidioService.create({
      cliente_id: formClienteId,
      valor_total: parseFloat(formValor),
      descripcion: formDescripcion,
    });
    setSaving(false);
    setOpenModal(false);
    setFormClienteId('');
    setFormValor('');
    setFormDescripcion('');
    load();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await SubsidioService.delete(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const filtered = subsidios.filter(s =>
    s.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
    s.cliente_cedula?.includes(search)
  );

  const totalSubsidios = subsidios.reduce((a, s) => a + s.valor_total, 0);
  const totalAbonado = subsidios.reduce((a, s) => a + (s.total_abonos || 0), 0);
  const totalPendiente = subsidios.reduce((a, s) => a + (s.pendiente || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DashboardHeader
        title="Subsidios"
        description="Gestión de subsidios y seguimiento de aportes por cliente."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Total Subsidios" value={formatCurrency(totalSubsidios)} color="text-[#D4A017]" icon="$" />
        <StatCard label="Total Abonado" value={formatCurrency(totalAbonado)} color="text-emerald-500" icon="✓" />
        <StatCard label="Total Pendiente" value={formatCurrency(totalPendiente)} color="text-rose-500" icon="⏳" />
      </div>

      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D4A017] transition-colors" />
          <input
            type="text"
            placeholder="Buscar por cliente o cédula..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#D4A017]/5 focus:border-[#D4A017] outline-none transition-all shadow-sm"
          />
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="h-14 bg-gradient-to-r from-[#D4A017] to-amber-400 hover:from-[#B8860B] hover:to-[#D4A017] text-white rounded-2xl font-black px-8 flex items-center gap-3 shadow-xl shadow-amber-100 transition-all hover:scale-[1.02] whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Nuevo Subsidio
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#0F0A4D]/3 to-transparent">
                {['Cliente', 'Cédula', 'Valor Subsidio', 'Abonos', 'Pendiente', ''].map(h => (
                  <th key={h} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-400">
                      <div className="w-5 h-5 rounded-full border-2 border-[#D4A017] border-t-transparent animate-spin" />
                      <span className="text-sm font-medium">Cargando subsidios...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-3xl">💰</div>
                      <p className="text-sm font-bold text-gray-400">No hay subsidios registrados.</p>
                      <p className="text-xs text-gray-300">Haz clic en "Nuevo Subsidio" para comenzar.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(s => {
                const pct = s.valor_total > 0 ? Math.min(100, Math.round(((s.total_abonos || 0) / s.valor_total) * 100)) : 0;
                return (
                  <tr key={s.id} className="hover:bg-[#D4A017]/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A017]/10 to-[#0F0A4D]/5 flex items-center justify-center text-[#0F0A4D] font-black text-sm">
                          {(s.cliente_nombre || '?').charAt(0)}
                        </div>
                        <span className="font-bold text-[#0B1E3F] truncate max-w-[160px]">{s.cliente_nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 font-medium">{s.cliente_cedula}</td>
                    <td className="px-6 py-5">
                      <span className="font-black text-[#D4A017] text-sm">{formatCurrency(s.valor_total)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <span className="font-black text-emerald-500 text-sm">{formatCurrency(s.total_abonos)}</span>
                        <div className="mt-1.5 w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`font-black text-sm px-3 py-1 rounded-xl ${(s.pendiente || 0) <= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {(s.pendiente || 0) <= 0 ? 'Al día ✓' : formatCurrency(s.pendiente)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/subsidios/${s.id}`}
                          className="p-2.5 text-gray-400 hover:text-[#D4A017] hover:bg-amber-50 rounded-xl transition-all"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <UIModal isOpen={openModal} onClose={() => setOpenModal(false)} title="Registrar Nuevo Subsidio">
        <form onSubmit={handleCreate} className="space-y-6 p-1">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Cliente</label>
            <select
              value={formClienteId}
              onChange={e => setFormClienteId(e.target.value)}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm bg-white focus:ring-2 focus:ring-[#D4A017]/20 focus:border-[#D4A017] outline-none transition-all"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} — {c.numero_documento}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Valor Total del Subsidio</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                type="number"
                value={formValor}
                onChange={e => setFormValor(e.target.value)}
                placeholder="0"
                required
                min={0}
                className="w-full pl-9 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#D4A017]/20 focus:border-[#D4A017] outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Descripción <span className="text-gray-300 normal-case font-medium tracking-normal">(opcional)</span></label>
            <textarea
              value={formDescripcion}
              onChange={e => setFormDescripcion(e.target.value)}
              placeholder="Detalles del subsidio..."
              rows={3}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#D4A017]/20 focus:border-[#D4A017] outline-none transition-all resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpenModal(false)} className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4A017] to-amber-400 text-white font-black hover:from-[#B8860B] hover:to-[#D4A017] transition-all shadow-lg shadow-amber-100 disabled:opacity-60">
              {saving ? 'Guardando...' : 'Registrar Subsidio'}
            </button>
          </div>
        </form>
      </UIModal>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.cliente_nombre || ''}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
