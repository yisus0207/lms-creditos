'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { Plus, Eye, Trash2, Search, TriangleAlert, X, Pencil } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SubsidioService } from '@/services/subsidio.service';
import { ClienteService } from '@/services/cliente.service';
import type { Subsidio, Cliente } from '@/types';
import UIModal from '@/components/ui/UIModal';
import SearchableSelect from '@/components/ui/SearchableSelect';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
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



export default function SubsidiosPage() {
  const [subsidios, setSubsidios] = useState<Subsidio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subsidio | null>(null);
  const [editTarget, setEditTarget] = useState<Subsidio | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClienteId || !formValor) return;
    setSaving(true);
    
    if (editTarget) {
      // Update mode
      await SubsidioService.update(editTarget.id, {
        valor_total: parseFloat(formValor),
        descripcion: formDescripcion,
      });
    } else {
      // Create mode
      await SubsidioService.create({
        cliente_id: formClienteId,
        valor_total: parseFloat(formValor),
        descripcion: formDescripcion,
      });
    }

    setSaving(false);
    handleCloseModal();
    load();
  };

  const handleEditOpen = (s: Subsidio) => {
    setEditTarget(s);
    setFormClienteId(s.cliente_id);
    setFormValor(s.valor_total.toString());
    setFormDescripcion(s.descripcion || '');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditTarget(null);
    setFormClienteId('');
    setFormValor('');
    setFormDescripcion('');
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
          onClick={() => {
            setEditTarget(null);
            setOpenModal(true);
          }}
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
                          onClick={() => handleEditOpen(s)}
                          className="p-2.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
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

      {/* Form Modal (Create/Edit) */}
      <UIModal 
        isOpen={openModal} 
        onClose={handleCloseModal} 
        title={editTarget ? "Editar Subsidio" : "Registrar Nuevo Subsidio"}
      >
        <form onSubmit={handleSubmit} className="space-y-8 p-1">
          <div className={editTarget ? 'opacity-50 pointer-events-none' : ''}>
            <SearchableSelect
              label="Cliente"
              placeholder="Seleccionar cliente..."
              value={formClienteId}
              onChange={setFormClienteId}
              options={clientes.map(c => ({
                id: c.id,
                label: c.nombre,
                sublabel: c.numero_documento
              }))}
            />
            {editTarget && <p className="text-[10px] text-[#D4A017] font-bold mt-2">El cliente no se puede cambiar al editar.</p>}
          </div>
          
          <div>
            <label className="block text-[11px] font-black text-[#0F0A4D]/40 uppercase tracking-widest mb-3">Valor Total del Subsidio</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4A017] font-black text-lg group-focus-within:scale-110 transition-transform">$</span>
              <input
                type="number"
                value={formValor}
                onChange={e => setFormValor(e.target.value)}
                placeholder="0"
                required
                min={0}
                className="w-full h-16 pl-12 pr-6 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-sm font-black text-[#0F0A4D] focus:ring-4 focus:ring-amber-400/5 focus:border-[#D4A017] focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-[#0F0A4D]/40 uppercase tracking-widest mb-3">Descripción <span className="text-gray-300 normal-case font-medium tracking-normal">(opcional)</span></label>
            <textarea
              value={formDescripcion}
              onChange={e => setFormDescripcion(e.target.value)}
              placeholder="Detalles del subsidio..."
              rows={3}
              className="w-full px-6 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-[24px] text-sm font-bold text-[#0F0A4D] focus:ring-4 focus:ring-amber-400/5 focus:border-[#D4A017] focus:bg-white outline-none transition-all resize-none shadow-inner-sm"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={handleCloseModal} 
              className="flex-1 h-14 rounded-[24px] bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className="flex-1 h-14 rounded-[24px] bg-gradient-to-r from-[#D4A017] to-amber-400 text-white font-black hover:from-[#B8860B] hover:to-[#D4A017] transition-all shadow-xl shadow-amber-100 disabled:opacity-60 hover:scale-[1.02] active:scale-95 flex items-center justify-center"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
              ) : (editTarget ? 'Guardar Cambios' : 'Registrar Subsidio')}
            </button>
          </div>
        </form>
      </UIModal>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar subsidio?"
          description={
            <>
              Se eliminará el subsidio de <span className="font-bold text-[#0B1E3F]">{deleteTarget.cliente_nombre}</span> y todos sus aportes. Esta acción es irreversible.
            </>
          }
        />
      )}
    </div>
  );
}
