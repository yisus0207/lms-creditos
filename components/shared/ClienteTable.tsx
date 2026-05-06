'use client';

import React from 'react';
import Link from 'next/link';
import type { Cliente } from '@/types';
import Badge from '../ui/Badge';
import { formatCompact, formatCurrency } from '@/lib/utils';

interface ClienteTableProps {
  clientes: Cliente[];
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  startIndex: number;
}

export default function ClienteTable({ clientes, onDelete, searchTerm, onSearchChange, startIndex }: ClienteTableProps) {

  const getStatusVariant = (estado?: string): 'info' | 'success' | 'warning' | 'error' | 'neutral' => {
    switch (estado) {
      case 'aprobado': return 'success';
      case 'banco': return 'info';
      case 'documentos': return 'warning';
      case 'viabilidad': return 'neutral';
      default: return 'neutral';
    }
  };

  const statusLabel = (estado?: string) => {
    if (estado === 'banco') return 'En Banco';
    if (!estado) return '—';
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-6">
      {/* Search — full width en mobile */}
      <div className="p-4 sm:p-6 border-b border-gray-50">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F0A4D]/10 focus:border-[#0F0A4D] transition-all text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* ============================================================
          VISTA MOBILE — Cards apiladas (< sm)
          ============================================================ */}
      <div className="sm:hidden divide-y divide-gray-50">
        {clientes.length === 0 && (
          <p className="p-8 text-center text-gray-400 text-sm italic">
            No hay clientes registrados o que coincidan con la búsqueda.
          </p>
        )}
        {clientes.map((cliente, index) => (
          <div key={cliente.id} className="flex items-center justify-between gap-3 px-4 py-3">
            {/* Número + nombre */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#0F0A4D]/5 flex items-center justify-center text-[#0F0A4D] font-bold text-xs shrink-0">
                {startIndex + index + 1}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#0F0A4D] text-sm truncate uppercase">{cliente.nombre}</p>
                <p className="text-[10px] text-gray-400 font-medium">{cliente.numero_documento}</p>
              </div>
            </div>

            {/* Estado + deuda + acción */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-end gap-1">
                <Badge variant={getStatusVariant(cliente.estado)} className="text-[9px]">
                  {statusLabel(cliente.estado)}
                </Badge>
                {(cliente.total_deuda ?? 0) > 0 && (
                  <span className="text-[10px] font-black text-rose-500">
                    {formatCompact(cliente.total_deuda ?? 0)}
                  </span>
                )}
              </div>
              <Link
                href={`/clientes/${cliente.id}`}
                className="p-2 text-gray-400 hover:text-[#D4A017] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
          VISTA DESKTOP — Tabla completa (sm+)
          ============================================================ */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Teléfono</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Total Generado</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Deuda</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clientes.map((cliente, index) => (
              <tr key={cliente.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0F0A4D]/5 flex items-center justify-center text-[#0F0A4D] font-bold text-xs">
                      {startIndex + index + 1}
                    </div>
                    <span className="font-semibold text-[#0F0A4D] whitespace-nowrap uppercase">{cliente.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-500 font-medium">{cliente.numero_documento}</td>
                <td className="px-6 py-5 text-sm text-gray-500 hidden md:table-cell">{cliente.telefono}</td>
                <td className="px-6 py-5">
                  <Badge variant={getStatusVariant(cliente.estado)}>
                    {statusLabel(cliente.estado)}
                  </Badge>
                </td>
                <td className="px-6 py-5 font-bold text-[#D4A017] text-sm hidden lg:table-cell">
                  {formatCurrency(cliente.total_generado ?? 0)}
                </td>
                <td className="px-6 py-5 font-bold text-rose-500 text-sm">
                  {formatCurrency(cliente.total_deuda ?? 0)}
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
                    Ver
                  </Link>
                  <button
                    onClick={() => onDelete(cliente.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
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
