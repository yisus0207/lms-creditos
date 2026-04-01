'use client';

import { useState } from 'react';
import { FileDown, FileText, Loader2, Sparkles } from 'lucide-react';
import { Cliente } from '@/types';

interface DocumentGeneratorProps {
  cliente: Cliente;
}

export default function DocumentGenerator({ cliente }: DocumentGeneratorProps) {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (tipo: 'viabilidad' | 'contrato') => {
    try {
      setGenerating(tipo);
      const response = await fetch('/api/documentos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clienteId: cliente.id, tipo }),
      });

      if (!response.ok) throw new Error('Error al generar el documento');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tipo === 'viabilidad' ? 'Viabilidad' : 'Contrato'}_${cliente.nombre.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al generar el documento');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-50 rounded-xl">
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-[#0F0A4D]">Automatización Documental</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => handleGenerate('viabilidad')}
          disabled={!!generating}
          className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-gray-100 hover:border-[#D4A017] hover:bg-amber-50/30 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            {generating === 'viabilidad' ? (
              <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
            ) : (
              <FileText className="w-6 h-6 text-amber-600" />
            )}
          </div>
          <div>
            <p className="font-bold text-[#0F0A4D]">Carta de Viabilidad</p>
            <p className="text-xs text-gray-500">Generar análisis preliminar</p>
          </div>
          <FileDown className="w-5 h-5 ml-auto text-gray-300 group-hover:text-amber-500 transition-colors" />
        </button>

        <button
          onClick={() => handleGenerate('contrato')}
          disabled={!!generating}
          className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-gray-100 hover:border-[#0F0A4D] hover:bg-blue-50/30 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            {generating === 'contrato' ? (
              <Loader2 className="w-6 h-6 text-[#0F0A4D] animate-spin" />
            ) : (
              <FileDown className="w-6 h-6 text-[#0F0A4D]" />
            )}
          </div>
          <div>
            <p className="font-bold text-[#0F0A4D]">Contrato de Gestión</p>
            <p className="text-xs text-gray-500">Generar contrato de servicios</p>
          </div>
          <FileDown className="w-5 h-5 ml-auto text-gray-300 group-hover:text-[#0F0A4D] transition-colors" />
        </button>
      </div>
    </div>
  );
}
