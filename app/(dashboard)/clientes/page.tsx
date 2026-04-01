'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClienteService } from '@/services/cliente.service';
import DashboardHeader from '@/components/layout/DashboardHeader';
import ClienteForm from '@/components/shared/ClienteForm';
import ClienteTable from '@/components/shared/ClienteTable';
import Modal from '@/components/ui/Modal';
import UIModal from '@/components/ui/UIModal';
import type { Cliente } from '@/types';
import { Plus, Users } from 'lucide-react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const loadClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ClienteService.getClientes();
      setClientes(data);
    } catch (err) {
      console.error('Error in loadClientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  const handleDelete = async (id: string) => {
    setConfirmModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!confirmModal.id) return;
    
    const result = await ClienteService.deleteCliente(confirmModal.id);
    if (result.success) {
      loadClientes();
    } else if (result.error) {
      setErrorModal({ isOpen: true, message: result.error });
    }
    setConfirmModal({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <DashboardHeader
        title="Gestión de Clientes"
        description="Administra la base de datos de prospectos y clientes activos."
        actions={
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A017] hover:bg-[#B8860B] text-[#0F0A4D] rounded-2xl font-black shadow-lg shadow-amber-900/10 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Nuevo Cliente
          </button>
        }
      />

      {/* Modal de Registro de Cliente */}
      <UIModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Registrar Nuevo Prospecto"
      >
        <ClienteForm 
          onSuccess={() => {
            loadClientes();
            setShowForm(false);
          }} 
        />
      </UIModal>

      {/* Listado de Clientes con Sombra Suave */}
      <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col h-96 items-center justify-center">
            <div className="relative mb-6">
               <div className="w-20 h-20 border-w-2 border-dashed border-gray-200 rounded-full animate-spin-slow"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Users className="w-8 h-8 text-[#D4A017] animate-pulse" />
               </div>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Sincronizando Cartera...</p>
          </div>
        ) : (
          <ClienteTable 
            clientes={clientes} 
            onDelete={handleDelete} 
          />
        )}
      </section>

      {/* Modales de Confirmación */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="¿Eliminar Registro?"
        variant="warning"
      >
        <p className="text-gray-500 font-medium leading-relaxed">
          Esta acción eliminará al cliente y todos sus datos asociados de forma permanente. Esta operación no se puede deshacer.
        </p>
      </Modal>

      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title="Acción No Permitida"
        variant="error"
      >
        {errorModal.message}
      </Modal>
    </div>
  );
}
