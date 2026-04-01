'use client';

import React, { useState, useEffect } from 'react';
import { ClienteService } from '@/services/cliente.service';
import { IngresoService } from '@/services/ingreso.service';
import type { Cliente, TipoIngreso, EstadoIngreso } from '@/types';
import Button from '@/components/ui/Button';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        {/* Cliente Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Cliente</label>
          <select
            required
            value={formData.cliente_id}
            onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium text-[#0F0A4D] focus:ring-2 focus:ring-[#D4A017]/20 transition-all cursor-pointer"
          >
            <option value="">Seleccionar cliente...</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Tipo */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Tipo de Cobro</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoIngreso })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium text-[#0F0A4D] focus:ring-2 focus:ring-[#D4A017]/20 transition-all"
            >
              <option value="viabilidad">Viabilidad</option>
              <option value="documentos">Documentos</option>
              <option value="comision">Comisión</option>
            </select>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value as EstadoIngreso })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium text-[#0F0A4D] focus:ring-2 focus:ring-[#D4A017]/20 transition-all"
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
            </select>
          </div>
        </div>

        {/* Monto & Fecha */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Monto ($)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium text-[#0F0A4D] focus:ring-2 focus:ring-[#D4A017]/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Fecha</label>
            <input
              type="date"
              required
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium text-[#0F0A4D] focus:ring-2 focus:ring-[#D4A017]/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          className="flex-1 py-4 rounded-2xl"
          loading={loading}
        >
          Guardar Registro
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 px-6 border border-gray-100 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
