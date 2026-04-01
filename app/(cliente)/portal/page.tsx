'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClienteService } from '@/services/cliente.service';
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
  ShieldCheck
} from 'lucide-react';
import { Suspense } from 'react';
import { formatCurrency } from '@/lib/utils';

function PortalContent() {
  const searchParams = useSearchParams();
  const clienteId = searchParams.get('clienteId');
  
  const [data, setData] = useState<{
    cliente: any;
    ingresos: any[];
    documentos: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clienteId) {
      setLoading(false);
      return;
    }

    async function loadPortalData() {
      const result = await ClienteService.getDetailedById(clienteId!);
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

  if (!clienteId || !data?.cliente) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto shadow-lg shadow-red-100">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-[#0F0A4D]">Acceso Restringido</h1>
        <p className="text-gray-500 font-medium leading-relaxed">
          No se ha encontrado una sesión activa o el enlace es inválido. Por favor, contacta a tu asesor de LMS Créditos.
        </p>
      </div>
    );
  }

  const { cliente, ingresos, documentos } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden bg-[#0F0A4D] rounded-[40px] p-8 sm:p-12 text-white shadow-2xl shadow-navy-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/images/logo.jpg" 
                alt="LMS Logo" 
                className="w-12 h-12 rounded-2xl border border-[#D4A017]/50 shadow-lg shadow-[#D4A017]/10"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4A017] leading-none">Conexión Segura</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40 mt-1">Portal del Cliente</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2">
              Hola, <span className="text-[#D4A017]">{cliente.nombre}</span>
            </h1>
            <p className="text-gray-400 font-medium max-w-md">
              Gestiona tu solicitud de crédito hipotecario y documentos desde tu espacio privado.
            </p>
          </div>
          <div className="hidden lg:block">
             <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center min-w-[200px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4A017] mb-2">Inversión Estimada</p>
                <p className="text-3xl font-black">{formatCurrency(cliente.valor_estimado || 0)}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#D4A017] rounded-full" />
          <h2 className="text-xl font-black text-[#0F0A4D] uppercase tracking-wider">Estado de tu Trámite</h2>
        </div>
        <Card padding="lg" hasAccent>
          <div className="px-4">
            <StatusTracker currentStep={cliente.estado} />
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Documents Section */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#D4A017] rounded-full" />
             <h2 className="text-xl font-black text-[#0F0A4D] uppercase tracking-wider">Documentos para Descarga</h2>
          </div>
          <Card padding="none" className="overflow-hidden">
             {documentos.length > 0 ? (
               <div className="divide-y divide-gray-50">
                 {documentos.map((doc) => (
                   <div key={doc.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-[#0F0A4D] group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-[#0F0A4D] tracking-tight">{doc.nombre}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-black text-[#0F0A4D] hover:bg-[#D4A017] hover:text-white hover:border-[#D4A017] transition-all shadow-sm">
                       <Download className="w-4 h-4" />
                       <span className="hidden sm:inline">DESCARGAR</span>
                     </button>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-20 text-center">
                 <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                 <p className="text-gray-400 font-bold italic tracking-tight">Tus documentos firmados aparecerán aquí pronto.</p>
               </div>
             )}
          </Card>
        </section>

        {/* Payments Sidebar */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#D4A017] rounded-full" />
             <h2 className="text-xl font-black text-[#0F0A4D] uppercase tracking-wider">Historial de Pagos</h2>
          </div>
          <Card padding="lg">
             {ingresos.length > 0 ? (
               <div className="space-y-6">
                 {ingresos.map((pago) => (
                   <div key={pago.id} className="flex items-start justify-between">
                     <div className="flex gap-4">
                        <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                        <div>
                           <p className="text-sm font-black text-[#0F0A4D] tracking-tight">{formatCurrency(pago.monto)}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase">{pago.tipo || 'Pago'}</p>
                        </div>
                     </div>
                     <p className="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-md uppercase tracking-tighter">
                        {new Date(pago.created_at).toLocaleDateString()}
                     </p>
                   </div>
                 ))}
                 <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Abonado</p>
                    <p className="text-xl font-black text-emerald-600 tracking-tighter">
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

      <footer className="pt-12 text-center border-t border-gray-50">
        <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em]">
          LMS Créditos &copy; {new Date().getFullYear()} – Excelencia Hipotecaria
        </p>
      </footer>
    </div>
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
