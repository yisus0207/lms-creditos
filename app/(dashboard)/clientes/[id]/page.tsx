'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ClienteService } from '@/services/cliente.service';
import type { Cliente, Ingreso, Documento } from '@/types';
import DashboardHeader from '@/components/layout/DashboardHeader';
import StatusTracker from '@/components/shared/StatusTracker';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DocumentGenerator from '@/components/shared/DocumentGenerator';
import { Eye, Download } from 'lucide-react';

export default function ClienteDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<{
    cliente: Cliente | null;
    ingresos: Ingreso[];
    documentos: Documento[];
  }>({
    cliente: null,
    ingresos: [],
    documentos: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const result = await ClienteService.getDetailedById(id as string);
    setData(result);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) return <div className="p-8 text-center text-gray-400">Cargando detalles del cliente...</div>;
  if (!data.cliente) return <div className="p-8 text-center text-red-500">Cliente no encontrado.</div>;

  const { cliente, ingresos, documentos } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Back link */}
      <div>
        <Link 
          href="/clientes" 
          className="inline-flex items-center gap-2 text-[#D4A017] hover:text-[#B8860B] font-bold mb-6 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-lg">Volver a Clientes</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Info Card */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
            <h2 className="text-3xl font-black text-[#0B1E3F] mb-10">{cliente.nombre}</h2>
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-0.5">Documento</p>
                  <p className="text-lg font-bold text-[#0B1E3F]">{cliente.numero_documento}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-0.5">Teléfono</p>
                  <p className="text-lg font-bold text-[#0B1E3F]">{cliente.telefono}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-lg font-bold text-[#0B1E3F] break-all">{cliente.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-0.5">Dirección</p>
                  <p className="text-lg font-bold text-[#0B1E3F]">{cliente.direccion || 'No registrada'}</p>
                </div>
              </div>
            </div>

            {/* Step Tracker section */}
            <div className="mt-16 pt-10 border-t border-gray-50">
              <h3 className="text-sm font-black text-[#0B1E3F] uppercase tracking-[0.2em] mb-8 text-center">Estado del Proceso</h3>
              <StatusTracker currentStep={cliente.estado || 'viabilidad'} />
            </div>
          </div>

          {/* New: Document Automation Section */}
          <DocumentGenerator cliente={cliente} />

          {/* Ingresos and Documentos Grid */}
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Ingresos Card */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-[#0B1E3F]">Ingresos</h3>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Total Acumulado</p>
                  <p className="text-2xl font-black text-[#D4A017]">{formatCurrency(cliente.total_generado || 0)}</p>
                </div>
              </div>
              <div className="space-y-6">
                {ingresos.length > 0 ? ingresos.map((ing) => (
                  <div key={ing.id} className="flex items-center justify-between p-5 rounded-3xl bg-[#F8F9FA]/50 group hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-[#D4A017] font-black text-xl">
                         $
                       </div>
                       <div>
                         <p className="text-base font-black text-[#0B1E3F] capitalize">{ing.tipo}</p>
                         <p className="text-xs text-gray-400 font-medium">{new Date(ing.fecha).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-base font-bold text-[#0B1E3F]">{formatCurrency(ing.monto)}</p>
                       <Badge variant={ing.estado === 'pagado' ? 'success' : 'warning'} className="!py-0.5 !px-3 !text-[10px] !font-bold">
                         {ing.estado?.toUpperCase()}
                       </Badge>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 italic py-4 text-center">No hay ingresos registrados.</p>
                )}
              </div>
            </div>

            {/* Documentos Card */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
              <h3 className="text-2xl font-black text-[#0B1E3F] mb-10">Documentos</h3>
              <div className="space-y-6">
                {documentos.length > 0 ? documentos.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-5 rounded-3xl bg-[#F8F9FA]/50 group hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                       </div>
                       <div>
                         <p className="text-base font-black text-[#0B1E3F]">{doc.tipo_documento}</p>
                         <p className="text-xs text-gray-400 font-medium">{new Date(doc.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                     <div className="flex items-center gap-2">
                        <Badge variant="info" className="!py-0.5 !px-3 !text-[10px] !font-bold !bg-blue-100 !text-blue-600 border-none">
                          SUBIDO
                        </Badge>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => doc.url_archivo && window.open(doc.url_archivo, '_blank')}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors" 
                            title="Previsualizar"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={async () => {
                              if (!doc.url_archivo) return;
                              const response = await fetch(doc.url_archivo);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${doc.tipo_documento.replace(/\s+/g, '_')}_${doc.id.substring(0,5)}.pdf`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                            }}
                            className="p-2 text-gray-400 hover:text-[#D4A017] transition-colors" 
                            title="Descargar"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                     </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 italic py-4 text-center">No hay documentos subidos.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm sticky top-6">
            <h3 className="text-2xl font-black text-[#0B1E3F] mb-10">Acciones Rápidas</h3>
            <div className="space-y-5">
              <Button className="w-full h-16 bg-[#D4A017] hover:bg-[#B8860B] text-white flex items-center justify-center gap-4 rounded-2xl border-none shadow-xl shadow-amber-100 font-black text-lg transition-all active:scale-95">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generar Documento
              </Button>
              <Button className="w-full h-16 bg-[#0B1E3F] hover:bg-[#152b54] text-white flex items-center justify-center gap-4 rounded-2xl border-none shadow-xl shadow-blue-100 font-black text-lg transition-all active:scale-95">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Subir Archivo
              </Button>
              <Button className="w-full h-16 bg-white hover:bg-gray-50 text-[#0B1E3F] flex items-center justify-center gap-4 rounded-2xl border-2 border-gray-100 font-black text-lg transition-all active:scale-95">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Llamar Cliente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
