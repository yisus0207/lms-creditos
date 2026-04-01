'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import IngresoSummary from '@/components/shared/IngresoSummary';
import IngresoFilters from '@/components/shared/IngresoFilters';
import IngresoTable from '@/components/shared/IngresoTable';
import IngresoForm from '@/components/shared/IngresoForm';
import UIModal from '@/components/ui/UIModal';
import { cn } from '@/lib/utils';
import { IngresoService, IngresoWithCliente } from '@/services/ingreso.service';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function IngresosPage() {
  const [ingresos, setIngresos] = useState<IngresoWithCliente[]>([]);
  const [filteredIngresos, setFilteredIngresos] = useState<IngresoWithCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pagado: 0, pendiente: 0 });
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = async () => {
    try {
      const [data, summary] = await Promise.all([
        IngresoService.getAll(),
        IngresoService.getSummary()
      ]);
      setIngresos(data);
      setFilteredIngresos(data);
      setStats(summary);
    } catch (err) {
      console.error('Error loading ingresos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadData();
  };

  useEffect(() => {
    let filtered = [...ingresos];

    if (search) {
      filtered = filtered.filter(i => 
        i.cliente_nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter(i => i.tipo?.toLowerCase() === type.toLowerCase());
    }

    if (status) {
      filtered = filtered.filter(i => i.estado === status);
    }

    setFilteredIngresos(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [search, type, status, ingresos]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIngresos = filteredIngresos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIngresos.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <DashboardHeader
        title="Control de Ingresos"
        description="Seguimiento financiero detallado de pagos y cobros pendientes."
        actions={
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Registrar Cobro
          </Button>
        }
      />

      <IngresoSummary stats={stats} />

      <div className="space-y-8">
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
          <IngresoFilters 
            onSearch={setSearch}
            onTypeChange={setType}
            onStatusChange={setStatus}
          />
        </div>
        
        <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                 <div className="w-12 h-12 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                 <p className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Sincronizando Finanzas...</p>
              </div>
            </div>
          ) : currentIngresos.length > 0 ? (
            <div className="flex flex-col">
              <IngresoTable ingresos={currentIngresos} />
              
              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white border border-gray-100 text-[#0F0A4D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          onClick={() => paginate(num)}
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all",
                            currentPage === num 
                              ? "bg-[#D4A017] text-[#0F0A4D] shadow-lg shadow-amber-900/10"
                              : "bg-white border border-gray-100 text-gray-400 hover:bg-gray-100"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-white border border-gray-100 text-[#0F0A4D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center text-gray-400 italic">
              No hay registros que coincidan con los filtros.
            </div>
          )}
        </section>
      </div>

      <UIModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Cobro"
      >
        <IngresoForm 
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </UIModal>
    </div>
  );
}
