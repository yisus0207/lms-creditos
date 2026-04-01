import { supabase } from '@/lib/supabase';
import type { Cliente } from '@/types';

export const ClienteService = {
  /**
   * Fetch all clients with summarized data (state and totals).
   */
  async getClientes(): Promise<Cliente[]> {
    const { data: clientes, error } = await supabase!
      .from('clientes')
      .select('*, ingresos(monto), operaciones(estado)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clientes:', error.message);
      return [];
    }

    // Process data to include virtual fields for UI
    return (clientes || []).map(c => ({
      ...c,
      estado: c.operaciones?.[0]?.estado || 'viabilidad',
      total_generado: c.ingresos?.reduce((acc: number, curr: any) => acc + (curr.monto || 0), 0) || 0
    }));
  },

  /**
   * Alias for getClientes()
   */
  async getAll(): Promise<Cliente[]> {
    return this.getClientes();
  },

  /**
   * Fetch a single client with full details and relations.
   */
  async getDetailedById(id: string): Promise<{ 
    cliente: Cliente | null, 
    ingresos: any[], 
    documentos: any[] 
  }> {
    const { data: cliente, error } = await supabase!
      .from('clientes')
      .select('*, ingresos(*), documentos(*), operaciones(estado)')
      .eq('id', id)
      .single();

    if (error || !cliente) {
      console.error('Error fetching cliente detail:', error?.message);
      return { cliente: null, ingresos: [], documentos: [] };
    }

    const processedCliente: Cliente = {
      ...cliente,
      estado: cliente.operaciones?.[0]?.estado || 'viabilidad',
      total_generado: cliente.ingresos?.reduce((acc: number, curr: any) => acc + (curr.monto || 0), 0) || 0
    };

    return {
      cliente: processedCliente,
      ingresos: cliente.ingresos || [],
      documentos: cliente.documentos || []
    };
  },

  /**
   * Fetch a single client basic info.
   */
  async getClienteById(id: string): Promise<Cliente | null> {
    const { data: cliente, error } = await supabase!
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !cliente) return null;
    return cliente;
  },

  /**
   * Create a new client.
   */
  async createCliente(data: Omit<Cliente, 'id' | 'created_at'>): Promise<Cliente | null> {
    const { data: newCliente, error } = await supabase!
      .from('clientes')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error creating cliente:', error.message);
      return null;
    }

    return newCliente;
  },

  /**
   * Delete a client by ID.
   * Note: This will fail if the client has associated records in the 'ingresos' table.
   */
  async deleteCliente(id: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase!
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === '23503') {
        return { 
          success: false, 
          error: 'No se puede eliminar el cliente porque tiene registros asociados (Pagos/Ingresos). Elimina primero sus registros vinculados.' 
        };
      }
      console.error(`Error deleting cliente ${id}:`, error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  /**
   * Update an existing client.
   */
  async update(id: string, data: Partial<Cliente>): Promise<Cliente | null> {
    const { data: updatedCliente, error } = await supabase!
      .from('clientes')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating cliente ${id}:`, error.message);
      return null;
    }

    return updatedCliente;
  },
};

