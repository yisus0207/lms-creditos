'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClienteService } from '@/services/cliente.service';
import DashboardHeader from '@/components/layout/DashboardHeader';
import ClienteForm from '@/components/shared/ClienteForm';
import ClienteTable from '@/components/shared/ClienteTable';
import Modal from '@/components/ui/Modal';
import UIModal from '@/components/ui/UIModal';
import type { Cliente } from '@/types';
import { cn } from '@/lib/utils';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { Plus, Users, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const [showImportModal, setShowImportModal] = useState(false);
  const [importTargetId, setImportTargetId] = useState('');
  const [importing, setImporting] = useState(false);

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

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredClientes = clientes.filter(c =>
    (c.tipo_tramite !== 'subsidio') && (
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.numero_documento.includes(searchTerm)
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = filteredClientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <DashboardHeader
        title="Gestión de Clientes"
        description="Administra la base de datos de prospectos y clientes activos."
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setImportTargetId('');
                setShowImportModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-[#0F0A4D] border border-gray-100 rounded-2xl font-black transition-all active:scale-95 whitespace-nowrap hidden sm:flex"
            >
              <Users className="w-5 h-5" />
              Vincular Cliente Existente
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A017] hover:bg-[#B8860B] text-[#0F0A4D] rounded-2xl font-black shadow-lg shadow-amber-900/10 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Nuevo Cliente Banco
            </button>
          </div>
        }
      />

      {/* Modal de Registro de Cliente */}
      <UIModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Registrar Nuevo Prospecto"
      >
        <ClienteForm
          defaultTipo="banco"
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
        ) : currentClientes.length > 0 ? (
          <div className="flex flex-col">
            <ClienteTable
              clientes={currentClientes}
              onDelete={handleDelete}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              startIndex={indexOfFirstItem}
            />

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
          <div className="flex flex-col h-96 items-center justify-center text-gray-400 italic font-medium">
            No hay clientes registrados en la base de datos.
          </div>
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

      {/* Modal Importar Cliente */}
      <UIModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Vincular Cliente de Subsidio"
      >
        <div className="p-2 space-y-6">
          <p className="text-sm text-gray-500 font-medium">
            Selecciona un cliente que actualmente está registrado solo para subsidios. Al vincularlo, también aparecerá aquí para gestionar su crédito en el banco, sin duplicar su cédula.
          </p>
          <SearchableSelect
            label="Cliente de Subsidio"
            placeholder="Buscar por nombre o cédula..."
            value={importTargetId}
            onChange={setImportTargetId}
            options={clientes
              .filter(c => c.tipo_tramite === 'subsidio')
              .map(c => ({
                id: c.id,
                label: c.nombre,
                sublabel: c.numero_documento
              }))}
          />
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowImportModal(false)}
              className="flex-1 h-14 rounded-[24px] bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                if (!importTargetId) return;
                setImporting(true);
                await ClienteService.update(importTargetId, { tipo_tramite: 'banco' });
                setImporting(false);
                setShowImportModal(false);
                loadClientes();
              }}
              disabled={!importTargetId || importing}
              className="flex-1 h-14 rounded-[24px] bg-gradient-to-r from-[#D4A017] to-amber-400 text-white font-black hover:from-[#B8860B] hover:to-[#D4A017] shadow-xl shadow-amber-100 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center"
            >
              {importing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
              ) : 'Confirmar Vinculación'}
            </button>
          </div>
        </div>
      </UIModal>
    </div>
  );
}
