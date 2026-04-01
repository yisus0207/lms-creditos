'use client';

import { useEffect, useState } from 'react';
import { DocumentoService } from '@/services/documento.service';
import type { Documento } from '@/types';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FileText, Download, User, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await DocumentoService.getAll();
        setDocumentos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardHeader 
        title="Gestión Documental" 
        subtitle="Registro centralizado de documentos generados y subidos."
      />

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-bold text-[#0F0A4D] flex items-center gap-3">
            <div className="p-2 bg-[#0F0A4D] rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Historial de Documentos
          </h3>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100">
            {documentos.length} Archivos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/30 text-left border-b border-gray-50">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Documento</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic">Cargando documentos...</td>
                </tr>
              ) : documentos.length > 0 ? (
                documentos.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-[#0F0A4D]">{doc.tipo_documento}</p>
                          <p className="text-xs text-gray-400">PDF / DOCX</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4 text-[#D4A017]" />
                        <span className="font-medium text-sm">ID: {doc.cliente_id.substring(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/clientes/${doc.cliente_id}`}
                          className="p-2.5 rounded-xl bg-gray-100 text-gray-400 hover:bg-[#0F0A4D] hover:text-white transition-all shadow-sm"
                          title="Ver Cliente"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <button 
                          className="p-2.5 rounded-xl bg-amber-50 text-[#D4A017] hover:bg-[#D4A017] hover:text-white transition-all shadow-sm"
                          title="Descargar"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic">No hay documentos registrados en el historial central.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
