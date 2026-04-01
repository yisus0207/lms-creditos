'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Cliente } from '@/types';
import Badge from '../ui/Badge';

interface ClienteTableProps {
  clientes: Cliente[];
  onDelete: (id: string) => void;
}

export default function ClienteTable({ clientes, onDelete }: ClienteTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClientes = clientes.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.numero_documento.includes(searchTerm)
  );

  const getStatusVariant = (estado?: string): 'info' | 'success' | 'warning' | 'error' | 'neutral' => {
    switch (estado) {
      case 'aprobado': return 'success';
      case 'banco': return 'info';
      case 'documentos': return 'warning';
      case 'viabilidad': return 'neutral';
      default: return 'neutral';
    }
  };

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-6">
      {/* Search & Filters */}
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F0A4D]/10 focus:border-[#0F0A4D] transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtrar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Generado</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F0A4D]/5 flex items-center justify-center text-[#0F0A4D] font-bold text-sm">
                      {cliente.nombre.charAt(0)}
                    </div>
                    <span className="font-semibold text-[#0F0A4D] truncate max-w-[150px]">{cliente.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-500 font-medium">{cliente.numero_documento}</td>
                <td className="px-6 py-5 text-sm text-gray-500">{cliente.telefono}</td>
                <td className="px-6 py-5">
                  <Badge variant={getStatusVariant(cliente.estado)}>
                    {cliente.estado === 'banco' ? 'En Banco' : cliente.estado?.charAt(0).toUpperCase() + (cliente.estado?.slice(1) || '')}
                  </Badge>
                </td>
                <td className="px-6 py-5 font-bold text-[#0F0A4D] text-sm">
                  {formatCurrency(cliente.total_generado)}
                </td>
                <td className="px-6 py-5 text-right space-x-2">
                  <Link 
                    href={`/clientes/${cliente.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Detalle
                  </Link>
                  <button
                    onClick={() => onDelete(cliente.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {filteredClientes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                  No hay clientes registrados o que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
