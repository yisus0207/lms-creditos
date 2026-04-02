'use client';

import { useEffect, useState } from 'react';
import { DocumentoService } from '@/services/documento.service';
import type { Documento } from '@/types';
import { cn } from '@/lib/utils';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { FileText, Download, User, Calendar, ExternalLink, Camera, Sparkles, Eye } from 'lucide-react';
import Link from 'next/link';
import ScannerModal from '@/components/shared/ScannerModal';
import DocumentPreviewModal from '@/components/shared/DocumentPreviewModal';
import Button from '@/components/ui/Button';

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const itemsPerPage = 10;

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await DocumentoService.getAll();
      setDocumentos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocs = documentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(documentos.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardHeader 
        title="Gestión Documental" 
        subtitle="Registro centralizado de documentos generados y subidos físicamente."
        actions={
          <Button 
            onClick={() => setIsScannerOpen(true)}
            className="bg-[#0F0A4D] hover:bg-navy-800 text-white gap-2 px-6 h-12 shadow-xl shadow-navy-900/10"
          >
            <Camera className="w-5 h-5 text-[#D4A017]" />
            Crear Documento Físico
          </Button>
        }
      />

      <ScannerModal 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSuccess={fetchDocs}
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
              ) : currentDocs.length > 0 ? (
                currentDocs.map((doc) => (
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
                          onClick={() => setSelectedDoc(doc)}
                          className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
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

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-[#0F0A4D] font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0F0A4D] hover:text-white transition-all shadow-sm"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => paginate(num)}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                      currentPage === num 
                        ? "bg-[#D4A017] text-[#0F0A4D] shadow-md shadow-amber-900/10"
                        : "bg-white border border-gray-100 text-gray-400 hover:bg-gray-50"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-[#0F0A4D] font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0F0A4D] hover:text-white transition-all shadow-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <DocumentPreviewModal 
        documento={selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
      />
    </div>
  );
}
