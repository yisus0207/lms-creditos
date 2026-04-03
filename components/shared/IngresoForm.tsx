'use client';

import React, { useState, useEffect } from 'react';
import { ClienteService } from '@/services/cliente.service';
import { IngresoService } from '@/services/ingreso.service';
import type { Cliente, TipoIngreso, EstadoIngreso } from '@/types';
import Button from '@/components/ui/Button';
import SearchableSelect from '@/components/ui/SearchableSelect';
import Select from '@/components/ui/Select';

interface IngresoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function IngresoForm({ onSuccess, onCancel }: IngresoFormProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cliente_id: '',
    tipo: 'viabilidad' as TipoIngreso,
    monto: '',
    estado: 'pendiente' as EstadoIngreso,
    fecha: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    async function loadClientes() {
      const data = await ClienteService.getClientes();
      setClientes(data);
    }
    loadClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cliente_id || !formData.monto) return;
    
    setLoading(true);
    try {
      const result = await IngresoService.create({
        cliente_id: formData.cliente_id,
        tipo: formData.tipo,
        monto: Number(formData.monto),
        estado: formData.estado,
        fecha: formData.fecha,
      });
      
      if (result) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error creating ingreso:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8">
        <SearchableSelect
          label="Cliente"
          placeholder="Seleccionar cliente..."
          options={clientes.map(c => ({
            id: c.id,
            label: c.nombre,
            sublabel: `Cédula: ${c.numero_documento}`
          }))}
          value={formData.cliente_id}
          onChange={(val) => setFormData({ ...formData, cliente_id: val })}
        />

        <div className="grid grid-cols-2 gap-6">
          {/* Tipo */}
          <Select
            label="Tipo de Cobro"
            options={[
              { id: 'viabilidad', label: 'Viabilidad' },
              { id: 'documentos', label: 'Documentos' },
              { id: 'comision', label: 'Comisión' }
            ]}
            value={formData.tipo}
            onChange={(val) => setFormData({ ...formData, tipo: val as TipoIngreso })}
          />

          {/* Estado */}
          <Select
            label="Estado"
            options={[
              { id: 'pendiente', label: 'Pendiente' },
              { id: 'pagado', label: 'Pagado' }
            ]}
            value={formData.estado}
            onChange={(val) => setFormData({ ...formData, estado: val as EstadoIngreso })}
          />
        </div>

        {/* Monto & Fecha */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#0F0A4D]/40 uppercase tracking-widest px-1 ml-1">Monto ($)</label>
            <div className="relative group">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4A017] font-black pointer-events-none group-focus-within:scale-110 transition-transform">$</span>
              <input
                type="number"
                required
                placeholder="0.00"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                className="w-full h-16 pl-12 pr-6 bg-gray-50/50 border-2 border-gray-100 rounded-[24px] text-sm font-black text-[#0F0A4D] focus:ring-4 focus:ring-amber-400/5 focus:border-[#D4A017] focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#0F0A4D]/40 uppercase tracking-widest px-1 ml-1">Fecha</label>
            <input
              type="date"
              required
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full h-16 px-6 bg-gray-50/50 border-2 border-gray-100 rounded-[24px] text-sm font-black text-[#0F0A4D] focus:ring-4 focus:ring-amber-400/5 focus:border-[#D4A017] focus:bg-white outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] h-14 rounded-[22px] bg-gradient-to-r from-[#D4A017] to-amber-400 text-white font-black hover:from-[#B8860B] hover:to-[#D4A017] transition-all shadow-xl shadow-amber-100 disabled:opacity-60 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
          ) : 'Guardar Registro'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-14 rounded-[22px] bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95 px-4"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
