import { supabase } from '@/lib/supabase';
import type { Operacion, Cliente } from '@/types';

export interface OperacionWithCliente extends Operacion {
  cliente: Cliente;
}

export const OperacionService = {
  /**
   * Fetch all operations with client details.
   * Ensures every client has an operation record by checking against the clients table.
   */
  async getAllWithClientes(): Promise<OperacionWithCliente[]> {
    // 1. Fetch all clients
    const { data: clientes, error: cliError } = await supabase!
      .from('clientes')
      .select('*')
      .or(`tipo_tramite.eq.banco,tipo_tramite.is.null`);

    if (cliError) {
      console.error('Error fetching clients for operations:', cliError.message);
      return [];
    }

    // 2. Fetch all existing operations
    const { data: operations, error: opError } = await supabase!
      .from('operaciones')
      .select('*');

    if (opError) {
      console.error('Error fetching operations:', opError.message);
      return [];
    }

    // 3. Merge and ensure every client is represented
    const results: OperacionWithCliente[] = [];

    for (const cliente of clientes) {
      let op = operations?.find(o => o.cliente_id === cliente.id);

      if (!op) {
        // Create a "virtual" or initial operation in DB if missing during load
        // Note: For large datasets, this should be done in bulk or on-demand
        op = await this.ensureOperacionExists(cliente.id);
      }

      if (op) {
        results.push({
          ...op,
          cliente
        });
      }
    }

    return results;
  },

  /**
   * Update the status of an operation.
   */
  async updateEstado(
    id: string,
    estado: Operacion['estado']
  ): Promise<boolean> {
    const { error } = await supabase!
      .from('operaciones')
      .update({ estado })
      .eq('id', id);

    if (error) {
      console.error(`Error updating operation ${id} to ${estado}:`, error.message);
      return false;
    }

    return true;
  },

  /**
   * Create an operation for a client if it doesn't exist.
   */
  async ensureOperacionExists(clienteId: string): Promise<Operacion | null> {
    // Check first
    const { data: existing } = await supabase!
      .from('operaciones')
      .select('*')
      .eq('cliente_id', clienteId)
      .single();

    if (existing) return existing;

    // Create new
    const { data: created, error } = await supabase!
      .from('operaciones')
      .insert([{
        cliente_id: clienteId,
        estado: 'viabilidad',
        banco: 'PENDIENTE',
        monto_credito: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error ensuring operation exists:', error.message);
      return null;
    }

    return created;
  }
};
