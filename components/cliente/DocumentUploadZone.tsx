'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { 
  Upload, 
  FileCheck, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  ChevronDown,
  Edit3,
  Type
} from 'lucide-react';
import Card from '@/components/ui/Card';

interface DocumentUploadZoneProps {
  clienteId: string;
  onSuccess: () => void;
}

const DOCUMENT_TYPES = [
  'Cédula de Ciudadanía',
  'Certificado Laboral',
  'Extractos Bancarios (Últimos 3 meses)',
  'Declaración de Renta',
  'Certificado de Libertad y Tradición',
  'Promesa de Compraventa',
  'Otro'
];

export default function DocumentUploadZone({ clienteId, onSuccess }: DocumentUploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tipo, setTipo] = useState<string>(DOCUMENT_TYPES[0]);
  const [nombrePersonalizado, setNombrePersonalizado] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const sanitizeName = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
  };

  const handleUpload = async () => {
    if (!file || !clienteId) return;

    setUploading(true);
    setStatus('idle');

    try {
      const finalName = tipo === 'Otro' ? (nombrePersonalizado || 'Documento_Extra') : tipo;
      const fileExt = file.name.split('.').pop();
      const sanitizedType = sanitizeName(finalName);
      
      // Rename file for storage: [TIPO]_[TIMESTAMP].[EXT]
      const filePath = `${clienteId}/${sanitizedType}_${Date.now()}.${fileExt}`;

      // 1. Upload to Supabase Storage
      const { error: storageError } = await supabase!.storage
        .from('documentos')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase!.storage
        .from('documentos')
        .getPublicUrl(filePath);

      // 3. Register in 'documentos' table
      const { error: dbError } = await supabase!
        .from('documentos')
        .insert([{
          cliente_id: clienteId,
          tipo_documento: finalName,
          url_archivo: publicUrl,
          subido_por: 'cliente',
          created_at: new Date().toISOString()
        }]);

      if (dbError) throw dbError;

      setStatus('success');
      setFile(null);
      setNombrePersonalizado('');
      onSuccess();
    } catch (error) {
      console.error('Error uploading document:', error);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card padding="none" className="overflow-hidden border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm group hover:border-[#D4A017] transition-all duration-500">
      <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[24px] flex items-center justify-center transition-all duration-500 shadow-xl ${
              status === 'success' ? 'bg-emerald-500 text-white rotate-[360deg]' : 
              status === 'error' ? 'bg-red-500 text-white' :
              'bg-[#0F0A4D] text-[#D4A017] group-hover:scale-110'
            }`}>
              {uploading ? <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" /> : 
               status === 'success' ? <FileCheck className="w-8 h-8 sm:w-10 sm:h-10" /> :
               status === 'error' ? <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8" /> :
               <Upload className="w-6 h-6 sm:w-8 sm:h-8" />}
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-[#0F0A4D] tracking-tight">Zona de Carga Segura</h4>
              <p className="text-[10px] sm:text-xs font-medium text-gray-500 max-w-[200px] mx-auto">Sube tus archivos para agilizar el trámite.</p>
            </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
            {/* Custom Styled Dropdown */}
            <div className="space-y-2 sm:space-y-3" ref={dropdownRef}>
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Tipo de Documento</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full h-14 bg-white border rounded-2xl px-5 flex items-center justify-between transition-all font-black text-sm uppercase tracking-tight shadow-sm hover:shadow-md ${
                    isDropdownOpen ? 'border-[#D4A017] ring-4 ring-[#D4A017]/10' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className={tipo === 'Otro' ? 'text-[#D4A017]' : 'text-[#0F0A4D]'}>
                    {tipo}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-3xl shadow-2xl p-2 z-50 animate-in zoom-in-95 duration-200 origin-top">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1 space-y-1">
                      {DOCUMENT_TYPES.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTipo(t);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            tipo === t 
                              ? 'bg-[#0F0A4D] text-[#D4A017]' 
                              : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F0A4D]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Name input if "Otro" is selected */}
            {tipo === 'Otro' && (
              <div className="space-y-3 animate-in slide-in-from-top-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4A017] ml-1 flex items-center gap-2">
                  <Type className="w-3 h-3" />
                  Nombre del Documento
                </label>
                <div className="relative group">
                  <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4A017] transition-colors" />
                  <input 
                    type="text"
                    required
                    value={nombrePersonalizado}
                    onChange={(e) => setNombrePersonalizado(e.target.value)}
                    placeholder="Ej: Impuesto Predial"
                    className="w-full h-12 bg-white border border-gray-100 rounded-2xl pl-12 pr-4 text-xs font-black text-[#0F0A4D] placeholder:text-gray-300 focus:outline-none focus:border-[#D4A017]/50 focus:ring-4 focus:ring-[#D4A017]/5"
                  />
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
            />

            {/* Custom Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 rounded-[32px] border-2 border-dashed text-center cursor-pointer transition-all duration-500 relative overflow-hidden group/box ${
                file 
                  ? 'bg-emerald-50/50 border-emerald-200' 
                  : 'bg-gray-50/50 border-gray-100 hover:border-[#D4A017] hover:bg-white shadow-inner active:scale-95'
              }`}
            >
              {file ? (
                <div className="space-y-2 animate-in zoom-in">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-200">
                    <FileCheck className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-black text-emerald-900 truncate px-4">{file.name}</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Listo para enviar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 mx-auto border border-gray-100 group-hover/box:scale-110 group-hover/box:rotate-12 transition-all">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-[#0F0A4D] uppercase tracking-tight">Seleccionar Archivo</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">PDF, PNG o JPG<br/>Máximo 5MB</p>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleUpload}
              disabled={!file || uploading || (tipo === 'Otro' && !nombrePersonalizado)}
              className={`w-full h-16 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl relative overflow-hidden ${
                file && !uploading 
                  ? 'bg-[#0F0A4D] text-[#D4A017] border-2 border-[#D4A017] shadow-[#D4A017]/20 hover:-translate-y-1 hover:shadow-[#D4A017]/40 ring-4 ring-[#D4A017]/10' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>SUBIENDO...</span>
                </>
              ) : (
                <>
                  <Sparkles className={`w-5 h-5 ${file ? 'animate-pulse text-[#D4A017]' : 'text-gray-300'}`} />
                  <span>CARGAR EXPEDIENTE</span>
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-3 justify-center py-4 px-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 animate-in slide-in-from-top-4">
                <FileCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">¡Documento Guardado!</span>
              </div>
            )}
        </div>
      </div>
      
      <div className="h-2 w-full bg-gray-50">
        <div 
          className={`h-full transition-all duration-1000 ${uploading ? 'bg-[#D4A017] w-full animate-shimmer' : 'w-0'}`} 
          style={{ width: uploading ? '100%' : '0%' }}
        />
      </div>
    </Card>
  );
}
