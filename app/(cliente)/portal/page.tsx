'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClienteService } from '@/services/cliente.service';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import StatusTracker from '@/components/shared/StatusTracker';
import { 
  FileText, 
  Download, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  PlusCircle,
  History
} from 'lucide-react';
import { Suspense } from 'react';
import { formatCurrency } from '@/lib/utils';
import ClientFinancialSummary from '@/components/cliente/ClientFinancialSummary';
import DocumentUploadZone from '@/components/cliente/DocumentUploadZone';
import Badge from '@/components/ui/Badge';
import UIModal from '@/components/ui/UIModal';
import { EstadoOperacion } from '@/types';
import { Eye, FileSearch, Loader2, Sparkles } from 'lucide-react';

function PortalContent() {
  const searchParams = useSearchParams();
  const clienteId = searchParams.get('clienteId');
  
  const [data, setData] = useState<{
    cliente: any;
    ingresos: any[];
    documentos: any[];
  } | null>(null);
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    async function loadPortalData() {
      setLoading(true);
      
      // 1. Try to get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      let effectiveId = clienteId;

      if (user && !effectiveId) {
        // 2. Fetch the client record associated with this auth user
        const { data: clientRecord, error: lookupError } = await supabase
          .from('clientes')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (clientRecord) {
          effectiveId = clientRecord.id;
        } else if (user.user_metadata?.cedula) {
          // Fallback: If user_id link failed during registration (e.g. missing column)
          // Try to find by cedula and repair the link
          const { data: byCedula } = await supabase
            .from('clientes')
            .select('id')
            .eq('numero_documento', user.user_metadata.cedula)
            .single();
          
          if (byCedula) {
            effectiveId = byCedula.id;
            // Attempt self-repair (optional but good)
            await supabase
              .from('clientes')
              .update({ user_id: user.id })
              .eq('id', byCedula.id);
          }
        }
      }

      if (!effectiveId) {
        setLoading(false);
        return;
      }

      setResolvedId(effectiveId);
      const result = await ClienteService.getDetailedById(effectiveId);
      setData(result);
      setLoading(false);
    }
    loadPortalData();
  }, [clienteId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black text-[#0F0A4D] uppercase tracking-[0.2em]">Autenticando Acceso...</p>
      </div>
    );
  }

  if (!resolvedId || !data?.cliente) {
    return (
      <main className="min-h-screen bg-[#FDFDFD] p-6 lg:p-12 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-8 animate-reveal-up">
          <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto shadow-lg shadow-red-100/50">
             <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-3">
             <h1 className="text-3xl font-black text-[#0F0A4D] uppercase tracking-tighter">Acceso Restringido</h1>
             <p className="text-gray-400 font-medium leading-relaxed">
               No se ha encontrado un perfil de cliente asociado a tu cuenta. 
               <br/><br/>
               <span className="block text-[10px] text-red-400 bg-red-50/50 px-4 py-3 rounded-2xl font-black uppercase tracking-widest border border-red-100">
                 TIP: Verifica si has activado RLS en Supabase y añadido la política de acceso para 'clientes'.
               </span>
             </p>
          </div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="text-[10px] font-black text-[#D4A017] uppercase tracking-[0.3em] hover:text-[#0F0A4D] transition-colors"
          >
            Volver al Inicio de Sesión
          </button>
        </div>
      </main>
    );
  }

  const { cliente, ingresos, documentos } = data;

  const handlePreview = (url: string, title: string) => {
    setPreviewDoc({ url, title });
    setIsPreviewOpen(true);
  };

  const handleDownload = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title || 'documento'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback
      window.open(url, '_blank');
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0F0A4D] to-[#FDFDFD] opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4A017] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 lg:px-12 py-12 relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden bg-[#0F0A4D] rounded-[40px] p-8 sm:p-12 text-white shadow-2xl shadow-navy-900/20 animate-reveal-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="animate-reveal-right" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/images/logo.jpg" 
                alt="LMS Logo" 
                className="w-12 h-12 rounded-2xl border border-[#D4A017]/50 shadow-lg shadow-[#D4A017]/10 animate-floating"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4A017] leading-none">Conexión Segura</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 mt-1">Portal del Cliente</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2">
              Hola, <span className="text-[#D4A017]">{cliente.nombre.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-400 font-medium max-w-md">
              Gestiona tu solicitud de crédito hipotecario y documentos desde tu espacio privado.
            </p>
          </div>
          <div className="hidden lg:block animate-reveal-up" style={{ animationDelay: '0.4s' }}>
             <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center min-w-[200px] hover:bg-white/10 transition-colors group">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4A017] mb-2 group-hover:scale-110 transition-transform">Inversión Estimada</p>
                <p className="text-3xl font-black group-hover:text-[#D4A017] transition-colors">{formatCurrency(cliente.valor_estimado || 0)}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <section className="animate-reveal-up" style={{ animationDelay: '0.2s' }}>
        <ClientFinancialSummary 
          montoTotal={cliente.monto_total_credito || 0}
          totalPagado={cliente.total_generado || 0}
        />
      </section>

      {/* Progress & Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <section className="lg:col-span-2 space-y-6 animate-reveal-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#D4A017] rounded-full animate-pulse" />
              <h2 className="text-xl font-black text-[#0F0A4D] uppercase tracking-wider">Estado de tu Trámite</h2>
            </div>
            <Badge 
              variant={cliente.estado === 'aprobado' ? 'success' : 'warning'} 
              className="uppercase tracking-widest px-4"
            >
              {cliente.estado}
            </Badge>
          </div>
          <Card padding="lg" hasAccent className="hover:!translate-y-0 shadow-none border border-gray-100 bg-white/50">
            <div className="px-4">
              <StatusTracker currentStep={cliente.estado as EstadoOperacion} />
            </div>
          </Card>
        </section>

        {/* Upload Zone - Instant Sidebar Access */}
        <section className="space-y-6 animate-reveal-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3">
            <PlusCircle className="w-5 h-5 text-[#D4A017]" />
            <h2 className="text-xl font-black text-[#0F0A4D] uppercase tracking-wider">Subir Requisito</h2>
          </div>
          <DocumentUploadZone 
            clienteId={resolvedId!} 
            onSuccess={() => {
              // Refresh data
              ClienteService.getDetailedById(resolvedId!).then(setData);
            }} 
          />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Documents Section */}
        <section className="lg:col-span-2 space-y-6 animate-reveal-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3">
             <History className="w-5 h-5 text-[#D4A017]" />
             <h2 className="text-xl font-black text-[#0F0A4D] uppercase tracking-wider">Tus Documentos</h2>
          </div>
          <Card padding="none" className="overflow-hidden hover:!translate-y-0 shadow-none hover:shadow-xl transition-shadow border border-gray-100 bg-white/40 backdrop-blur-md">
             {documentos.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {documentos.map((doc, idx) => (
                    <div key={doc.id} 
                      className="flex items-center justify-between p-6 hover:bg-white/50 transition-all group animate-reveal-right border-b border-gray-100 last:border-0"
                      style={{ animationDelay: `${0.5 + (idx * 0.1)}s` }}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#0F0A4D]/5 rounded-2xl flex items-center justify-center text-[#0F0A4D] group-hover:scale-110 group-hover:bg-[#0F0A4D] group-hover:text-[#D4A017] transition-all duration-500 shadow-sm font-black">
                          {doc.tipo_documento?.toLowerCase().includes('pdf') || doc.url_archivo.endsWith('.pdf') ? 'PDF' : <FileText className="w-7 h-7" />}
                        </div>
                        <div>
                          <p className="font-black text-[#0F0A4D] text-lg tracking-tight group-hover:translate-x-1 transition-transform">
                            {doc.tipo_documento || 'Documento'}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(doc.created_at).toLocaleDateString()}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                            <span className="text-[10px] font-black text-[#D4A017] uppercase tracking-widest">Verificado</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handlePreview(doc.url_archivo, doc.tipo_documento)}
                          className="w-12 h-12 bg-[#E8F1FF] text-[#0066FF] rounded-2xl flex items-center justify-center hover:bg-[#D1E4FF] transition-all shadow-sm active:scale-95 group/preview"
                          title="Previsualizar"
                        >
                          <Eye className="w-6 h-6 group-hover/preview:scale-110 transition-transform" />
                        </button>
                        
                        <button 
                          onClick={() => handleDownload(doc.url_archivo, doc.tipo_documento)}
                          className="w-12 h-12 bg-[#FFF9E8] text-[#D4A017] rounded-2xl flex items-center justify-center hover:bg-[#FFF3D1] transition-all shadow-sm active:scale-95 group/download"
                          title="Descargar Directamente"
                        >
                          <Download className="w-6 h-6 group-hover/download:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             ) : (
                <div className="p-20 text-center animate-pulse">
                  <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold italic tracking-tight">Tus documentos firmados aparecerán aquí pronto.</p>
                </div>
             )}
          </Card>
        </section>

        {/* Payments Sidebar */}
        <section className="space-y-6 animate-reveal-up" style={{ animationDelay: '0.5s' }}>
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#D4A017] rounded-full" />
             <h2 className="text-xl font-black text-[#0F0A4D] uppercase tracking-wider">Historial de Pagos</h2>
          </div>
          <Card padding="lg" className="hover:!translate-y-0 shadow-none hover:shadow-xl transition-shadow">
             {ingresos.length > 0 ? (
               <div className="space-y-6">
                 {ingresos.map((pago, idx) => (
                   <div key={pago.id} 
                     className="flex items-start justify-between animate-reveal-up"
                     style={{ animationDelay: `${0.6 + (idx * 0.1)}s` }}
                   >
                     <div className="flex gap-4 group">
                        <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50 group-hover:scale-150 transition-transform" />
                        <div>
                           <p className="text-sm font-black text-[#0F0A4D] tracking-tight group-hover:text-emerald-600 transition-colors">{formatCurrency(pago.monto)}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase">{pago.tipo || 'Pago'}</p>
                        </div>
                     </div>
                     <p className="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-md uppercase tracking-tighter">
                        {new Date(pago.created_at).toLocaleDateString()}
                     </p>
                   </div>
                 ))}
                 <div className="pt-6 border-t border-gray-100 flex justify-between items-end animate-reveal-up" style={{ animationDelay: '0.8s' }}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Abonado</p>
                    <p className="text-xl font-black text-emerald-600 tracking-tighter group-hover:scale-110 transition-transform">
                      {formatCurrency(ingresos.reduce((acc, curr) => acc + (curr.monto || 0), 0))}
                    </p>
                 </div>
               </div>
             ) : (
               <div className="py-12 text-center text-gray-300">
                  <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Sin movimientos registrados</p>
               </div>
             )}
          </Card>
        </section>
      </div>

      <footer className="pt-12 text-center border-t border-gray-100">
        <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em]">
          LMS Créditos &copy; {new Date().getFullYear()} – Excelencia Hipotecaria
        </p>
      </footer>

      {/* Document Preview Modal */}
      <UIModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={previewDoc?.title || 'Previsualización'}
        maxWidth="max-w-5xl"
      >
        <div className="h-[70vh] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          {previewDoc?.url.toLowerCase().endsWith('.pdf') || previewDoc?.url.includes('pdf') ? (
            <iframe 
              src={`${previewDoc?.url}#toolbar=0`}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img 
                src={previewDoc?.url} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button 
            onClick={() => handleDownload(previewDoc?.url || '', previewDoc?.title || 'documento')}
            className="px-6 py-3 bg-[#0F0A4D] text-[#D4A017] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#1a2b56] transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar Documento
          </button>
        </div>
      </UIModal>
    </div>
  </main>
);
}

export default function PortalPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black text-[#0F0A4D] uppercase tracking-[0.2em]">Cargando Portal...</p>
      </div>
    }>
      <PortalContent />
    </Suspense>
  );
}
