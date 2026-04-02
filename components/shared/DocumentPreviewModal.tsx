'use client';

import UIModal from '@/components/ui/UIModal';
import Button from '@/components/ui/Button';
import { ExternalLink, Sparkles } from 'lucide-react';
import { Documento } from '@/types';

interface DocumentPreviewModalProps {
  documento: Documento | null;
  onClose: () => void;
}

export default function DocumentPreviewModal({ documento, onClose }: DocumentPreviewModalProps) {
  return (
    <UIModal
      isOpen={!!documento}
      onClose={onClose}
      title={`Vista Previa: ${documento?.tipo_documento}`}
      maxWidth="max-w-5xl"
    >
      <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 h-[70vh] relative group/preview">
        {documento?.url_archivo ? (
          <iframe 
            src={`${documento.url_archivo}#toolbar=0`} 
            className="w-full h-full"
            title="Document Preview"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
            <Sparkles className="w-12 h-12 opacity-20" />
            <p className="font-medium italic">Archivo no disponible para previsualización.</p>
          </div>
        )}
        
        <div className="absolute top-4 right-4 animate-in fade-in duration-500">
          <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#0F0A4D] border border-white/20 shadow-xl">
            Modo de Lectura Segura
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs text-gray-400 italic">
          ID de Documento: {documento?.id}
        </p>
        <Button 
          onClick={() => documento?.url_archivo && window.open(documento.url_archivo, '_blank')}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir en pestaña completa
        </Button>
      </div>
    </UIModal>
  );
}
