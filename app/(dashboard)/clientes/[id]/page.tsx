'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ClienteService } from '@/services/cliente.service';
import { DocumentoService } from '@/services/documento.service';
import type { Cliente, Ingreso, Documento } from '@/types';
import DashboardHeader from '@/components/layout/DashboardHeader';
import StatusTracker from '@/components/shared/StatusTracker';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DocumentPreviewModal from '@/components/shared/DocumentPreviewModal';
import ScannerModal from '@/components/shared/ScannerModal';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import { Eye, Download, Trash2, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Documento | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteDocument = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const success = await DocumentoService.deleteDocumento(deleteTarget);
      if (!success) throw new Error('Error al eliminar el documento');
      
      setDeleteTarget(null);
      fetchDetail();
    } catch (err) {
      console.error(err);
      alert('Error eliminando el documento');
    } finally {
      setIsDeleting(false);
    }
  };

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
          <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 p-6 sm:p-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1E3F] mb-6 sm:mb-10">{cliente.nombre}</h2>
            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-12 gap-y-5 sm:gap-y-8">
              <div className="flex items-center gap-2 sm:gap-5 min-w-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] sm:text-sm text-gray-400 font-bold uppercase tracking-[0.1em] sm:tracking-widest mb-0.5 truncate">Documento</p>
                  <p className="text-[10px] sm:text-lg font-bold text-[#0B1E3F] truncate">{cliente.numero_documento}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-5 min-w-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] sm:text-sm text-gray-400 font-bold uppercase tracking-[0.1em] sm:tracking-widest mb-0.5 truncate">Teléfono</p>
                  <p className="text-[10px] sm:text-lg font-bold text-[#0B1E3F] truncate">{cliente.telefono}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-5 min-w-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] sm:text-sm text-gray-400 font-bold uppercase tracking-[0.1em] sm:tracking-widest mb-0.5 truncate">Email</p>
                  <p className="text-[10px] sm:text-lg font-bold text-[#0B1E3F] truncate">{cliente.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-5 min-w-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] sm:text-sm text-gray-400 font-bold uppercase tracking-[0.1em] sm:tracking-widest mb-0.5 truncate">Dirección</p>
                  <p className="text-[10px] sm:text-lg font-bold text-[#0B1E3F] truncate">{cliente.direccion || 'No registrada'}</p>
                </div>
              </div>
            </div>

            {/* Step Tracker section */}
            <div className="mt-16 pt-10 border-t border-gray-50">
              <h3 className="text-sm font-black text-[#0B1E3F] uppercase tracking-[0.2em] mb-8 text-center">Estado del Proceso</h3>
              <StatusTracker currentStep={cliente.estado || 'viabilidad'} />
            </div>
          </div>

          {/* Main Info Box Closed Above */}

          {/* Ingresos and Documentos Stack */}
          <div className="flex flex-col gap-8">
            {/* Ingresos Card */}
            <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
                <h3 className="text-xl sm:text-2xl font-black text-[#0B1E3F]">Ingresos y Deudas</h3>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-right bg-gray-50 rounded-2xl p-3 sm:p-4 w-full lg:w-auto">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Deuda Pendiente</p>
                    <p className="text-xl font-black text-rose-500">{formatCurrency(cliente.total_deuda || 0)}</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200 hidden sm:block mx-2"></div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Total Generado</p>
                    <p className="text-2xl font-black text-[#D4A017]">{formatCurrency(cliente.total_generado || 0)}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingresos.length > 0 ? ingresos.map((ing) => (
                  <div key={ing.id} className="flex items-center justify-between p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] bg-[#F8F9FA]/80 group hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                       <div className="w-12 h-12 flex-shrink-0 rounded-[18px] bg-amber-50 flex items-center justify-center text-[#D4A017] font-black text-xl shadow-sm">
                         $
                       </div>
                       <div className="min-w-0 pr-2">
                         <p className="text-sm sm:text-base font-black text-[#0B1E3F] capitalize truncate">{ing.tipo}</p>
                         <p className="text-xs text-gray-400 font-medium">{new Date(ing.fecha).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                       <p className="text-sm sm:text-base font-bold text-[#0B1E3F]">{formatCurrency(ing.monto)}</p>
                       <Badge variant={ing.estado === 'pagado' ? 'success' : 'warning'} className="!py-0.5 !px-3 !text-[10px] !font-bold mt-1 inline-block">
                         {ing.estado?.toUpperCase()}
                       </Badge>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full">
                    <p className="text-sm text-gray-400 italic py-4 text-center bg-gray-50 rounded-2xl">No hay ingresos registrados.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documentos Card */}
            <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-black text-[#0B1E3F] mb-6 sm:mb-8">Documentos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentos.length > 0 ? documentos.map((doc) => (
                  <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] bg-[#F8F9FA]/80 group hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                       <div className="w-12 h-12 flex-shrink-0 rounded-[18px] bg-blue-50/50 flex items-center justify-center text-blue-500 shadow-sm">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                       </div>
                       <div className="min-w-0 pr-2">
                         <p className="text-sm sm:text-base font-black text-[#0B1E3F] truncate">{doc.tipo_documento}</p>
                         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{new Date(doc.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0 justify-end w-full sm:w-auto">
                      <button 
                        onClick={() => setSelectedDoc(doc)}
                        className="p-2 text-blue-500 bg-blue-50/80 hover:bg-blue-100 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5" 
                        title="Previsualizar"
                      >
                        <Eye className="w-4.5 h-4.5" />
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
                        className="p-2 text-[#D4A017] bg-amber-50/80 hover:bg-amber-100 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5" 
                        title="Descargar"
                      >
                        <Download className="w-4.5 h-4.5" />
                      </button>
                      <button 
                        onClick={() => setDeleteTarget(doc)}
                        className="p-2 text-rose-500 bg-rose-50/80 hover:bg-rose-100 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5" 
                        title="Eliminar"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full">
                    <p className="text-sm text-gray-400 italic py-4 text-center bg-gray-50 rounded-2xl">No hay documentos subidos.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 p-6 sm:p-10 shadow-sm sticky top-6">
            <h3 className="text-xl sm:text-2xl font-black text-[#0B1E3F] mb-6 sm:mb-10">Acciones Rápidas</h3>
            <div className="space-y-4 sm:space-y-5">
              <Button 
                onClick={() => setIsScannerOpen(true)}
                className="w-full h-16 bg-[#0B1E3F] hover:bg-[#152b54] text-white flex items-center justify-center gap-4 rounded-2xl border-none shadow-xl shadow-blue-100 font-black text-lg transition-all active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Subir Archivo
              </Button>
              <Button 
                onClick={() => {
                  if (!cliente.telefono) return alert("El cliente no tiene teléfono registrado");
                  let phone = cliente.telefono.replace(/\D/g, '');
                  if (phone.length === 10) phone = '57' + phone;
                  window.open(`https://wa.me/${phone}`, '_blank');
                }}
                className="w-full h-16 bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-4 rounded-2xl border-none shadow-xl shadow-green-100 font-black text-lg transition-all active:scale-95"
              >
                <MessageCircle className="w-6 h-6" />
                Contactar Cliente
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DocumentPreviewModal 
        documento={selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
      />

      <ScannerModal 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSuccess={fetchDetail}
        defaultClienteId={cliente.id}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteDocument}
        isLoading={isDeleting}
        title="¿Eliminar documento?"
        description={
          <>
            ¿Estás seguro de que deseas eliminar permanentemente el documento <span className="font-bold text-[#0B1E3F]">"{deleteTarget?.tipo_documento}"</span>? Esta acción es irreversible.
          </>
        }
      />
    </div>
  );
}
