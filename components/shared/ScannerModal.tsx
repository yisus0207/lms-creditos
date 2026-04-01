'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Plus, 
  X, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Trash2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  UploadCloud
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { supabase } from '@/lib/supabase';
import { ClienteService } from '@/services/cliente.service';
import { cn } from '@/lib/utils';
import type { Cliente } from '@/types';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DOCUMENT_TYPES = [
  'Cédula de Ciudadanía',
  'Certificado Laboral',
  'Extractos Bancarios',
  'Declaración de Renta',
  'Certificado de Tradición',
  'Poder Firmado',
  'Otros'
];

export default function ScannerModal({ isOpen, onClose, onSuccess }: ScannerModalProps) {
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0]);
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    const allClients = await ClienteService.getClientes();
    setClients(allClients);
  };

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const generatePDFAndSave = async () => {
    if (!selectedClientId || images.length === 0) return;

    setIsSaving(true);
    try {
      // 1. Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        
        // Simple A4 fill (optimized for performance)
        pdf.addImage(images[i], 'JPEG', 10, 10, pageWidth - 20, pageHeight - 20);
      }

      const pdfBlob = pdf.output('blob');
      const fileName = `escaneo_${Date.now()}.pdf`;
      const filePath = `${selectedClientId}/${fileName}`;

      // 2. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, pdfBlob);

      if (uploadError) {
        // Fallback or more specific error for admin
        console.error('Upload error detail:', uploadError);
        throw new Error('Error al subir el archivo al almacenamiento de Supabase. Verifica el bucket "documentos".');
      }

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documentos')
        .getPublicUrl(filePath);

      // 4. Save to Database
      const { error: dbError } = await supabase
        .from('documentos')
        .insert([{
          cliente_id: selectedClientId,
          tipo_documento: docType,
          url_archivo: publicUrl,
          subido_por: 'Administrador'
        }]);

      if (dbError) throw dbError;

      onSuccess();
      onClose();
      // Reset state for next scan
      setStep(1);
      setImages([]);
      setSelectedClientId('');
    } catch (err: any) {
      console.error('Error saving document:', err.message);
      alert(err.message || 'Error guardando documento.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0F0A4D]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-[#0F0A4D] px-8 py-8 text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#D4A017]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017]">Escáner de Documentos</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">Nuevo Escaneo</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Steps Content */}
        <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Progress Markers */}
          <div className="flex items-center justify-between mb-10 px-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black tracking-widest transition-all duration-500",
                    step === i 
                      ? "bg-[#D4A017] text-[#0F0A4D] scale-110 shadow-lg shadow-amber-900/20" 
                      : step > i 
                        ? "bg-emerald-500 text-white" 
                        : "bg-gray-100 text-gray-400"
                  )}
                >
                  {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
                {i < 3 && <div className={cn("w-12 h-1 rounded-full", step > i ? "bg-emerald-500" : "bg-gray-100")} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
              <div>
                <label className="block text-[11px] font-black text-[#0F0A4D]/40 uppercase tracking-widest mb-4">
                  1. Seleccione al Beneficiario
                </label>
                <select 
                  className="w-full h-16 bg-gray-50 border-gray-100 border-2 rounded-[24px] px-8 text-sm font-bold text-[#0F0A4D] focus:border-[#D4A017] focus:ring-0 transition-all outline-none"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  <option value="">Buscar nombre o cédula...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.nombre} — {client.numero_documento}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#0F0A4D]/40 uppercase tracking-widest mb-4">
                  2. Tipo de Documento Físico
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {DOCUMENT_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setDocType(type)}
                      className={cn(
                        "px-5 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-wider text-left transition-all border-2 relative overflow-hidden",
                        docType === type 
                          ? "bg-[#D4A017] border-[#D4A017] text-[#0F0A4D] shadow-md" 
                          : "bg-white border-gray-100 text-[#0F0A4D]/50 hover:border-gray-200"
                      )}
                    >
                      {type}
                      {docType === type && (
                        <div className="absolute top-1 right-1 opacity-20">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!selectedClientId}
                onClick={() => setStep(2)}
                className="w-full h-16 bg-[#0F0A4D] text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-navy-800 disabled:opacity-40 transition-all mt-10 shadow-xl shadow-navy-900/10"
              >
                Comenzar Escaneo <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-50 rounded-[40px] p-12 border-4 border-dashed border-gray-200 flex flex-col items-center justify-center gap-5 cursor-pointer group hover:border-[#D4A017] hover:bg-[#D4A017]/5 transition-all"
              >
                <div className="w-24 h-24 rounded-full bg-[#0F0A4D] flex items-center justify-center text-[#D4A017] group-hover:scale-110 shadow-2xl shadow-[#0F0A4D]/20 transition-transform">
                  <Camera className="w-10 h-10" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black text-[#0F0A4D] uppercase tracking-wider mb-2">Capturar Página</h3>
                  <p className="text-xs text-gray-400 font-bold max-w-xs mx-auto uppercase tracking-widest">
                    Utilice la cámara trasera para mejor resolución
                  </p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  multiple 
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleCapture}
                />
                <div className="mt-4 bg-[#D4A017] text-[#0F0A4D] px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[13px] flex items-center gap-3 shadow-lg shadow-amber-900/10 active:scale-95 transition-all">
                  <Plus className="w-6 h-6" /> Tomar Foto Nueva
                </div>
              </div>

              {images.length > 0 && (
                <div className="space-y-5">
                  <div className="flex justify-between items-end px-2">
                    <div>
                      <h4 className="text-[12px] font-black text-[#0F0A4D] uppercase tracking-widest">Previsualización</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{images.length} Páginas listas</p>
                    </div>
                    <button 
                      onClick={() => setImages([])}
                      className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Borrar Todo
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pb-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md transform hover:-rotate-1 transition-all">
                        <img src={img} className="w-full h-full object-cover" alt={`Página ID ${idx + 1}`} />
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#0F0A4D] text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                          {idx + 1}
                        </div>
                        <button
                          onClick={() => removePage(idx)}
                          className="absolute inset-0 bg-rose-600/90 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-6 h-6 mb-1" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Eliminar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-10">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 h-16 border-2 border-gray-100 text-[#0F0A4D]/60 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" /> Atrás
                </button>
                <button
                  disabled={images.length === 0}
                  onClick={() => setStep(3)}
                  className="flex-[2] h-16 bg-[#0F0A4D] text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-navy-800 disabled:opacity-40 transition-all shadow-xl shadow-navy-900/10"
                >
                  Cerrar Escaneo <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 py-6 animate-in fade-in slide-in-from-bottom-10">
              <div className="text-center">
                <div className="w-24 h-24 rounded-[32px] bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto mb-8 border-2 border-emerald-100 relative group">
                  <FileText className="w-12 h-12" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-[#0F0A4D] mb-4 tracking-tighter">¿Todo Correcto?</h3>
                <p className="text-[13px] text-gray-500 font-medium px-12 leading-relaxed">
                  Se unificarán las <span className="text-[#0F0A4D] font-black">{images.length} capturas</span> en un archivo PDF optimizado para:
                </p>
                <p className="mt-3 text-lg font-black text-[#D4A017] uppercase tracking-widest">
                  {clients.find(c => c.id === selectedClientId)?.nombre}
                </p>
              </div>

              <div className="bg-navy-900/5 rounded-[32px] p-8 border-2 border-dashed border-gray-200">
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#0F0A4D]/50 border-b border-gray-100 pb-3">
                    <span>Expediente:</span>
                    <span className="text-[#0F0A4D]">{clients.find(c => c.id === selectedClientId)?.numero_documento}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#0F0A4D]/50 border-b border-gray-100 pb-3">
                    <span>Clasificación:</span>
                    <span className="text-[#D4A017]">{docType}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#0F0A4D]/50">
                    <span>Total de Páginas:</span>
                    <span className="text-[#0F0A4D]">{images.length} pags</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  disabled={isSaving}
                  onClick={generatePDFAndSave}
                  className="w-full h-18 bg-[#0F0A4D] text-white rounded-[28px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-4 hover:bg-navy-800 shadow-2xl shadow-navy-900/30 transition-all disabled:opacity-80 group active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-[#D4A017]" /> Generando PDF & Subiendo...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-[#D4A017] group-hover:-translate-y-1 transition-transform" /> 
                      Confirmar y Generar PDF
                    </>
                  )}
                </button>
                <button
                  disabled={isSaving}
                  onClick={() => setStep(2)}
                  className="w-full py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] hover:text-rose-500 transition-colors"
                >
                  Revisar documentos tomados
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom decorative bar */}
        <div className="h-2.5 w-full bg-[#D4A017] shadow-[0_-4px_15px_rgba(212,160,23,0.3)]" />
      </div>
    </div>
  );
}
