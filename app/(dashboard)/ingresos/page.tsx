'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import IngresoSummary from '@/components/shared/IngresoSummary';
import IngresoFilters from '@/components/shared/IngresoFilters';
import IngresoTable from '@/components/shared/IngresoTable';
import IngresoForm from '@/components/shared/IngresoForm';
import UIModal from '@/components/ui/UIModal';
import { IngresoService, IngresoWithCliente } from '@/services/ingreso.service';
import { Plus } from 'lucide-react';
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
  }, [search, type, status, ingresos]);

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
          ) : (
            <IngresoTable ingresos={filteredIngresos} />
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
