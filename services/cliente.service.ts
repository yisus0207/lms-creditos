import { supabase } from '@/lib/supabase';
import type { Cliente, Ingreso, Documento } from '@/types';
import { SubsidioService } from './subsidio.service';
import { DocumentoService } from './documento.service';

// Utility to calculate real net debt per category
function calculateNetDebt(ingresos: any[] | undefined): number {
  if (!ingresos || ingresos.length === 0) return 0;

  const debtByType: Record<string, number> = {};
  const paidByType: Record<string, number> = {};

  ingresos.forEach(ing => {
    const tipo = ing.tipo;
    const monto = ing.monto || 0;

    if (ing.estado === 'pendiente') {
      debtByType[tipo] = (debtByType[tipo] || 0) + monto;
    } else if (ing.estado === 'pagado') {
      paidByType[tipo] = (paidByType[tipo] || 0) + monto;
    }
  });

  let totalDebt = 0;
  // Calculate net remaining debt for each known type
  ['viabilidad', 'documentos', 'comision'].forEach(tipo => {
    const pending = debtByType[tipo] || 0;
    const paid = paidByType[tipo] || 0;
    const remaining = pending - paid;
    if (remaining > 0) {
      totalDebt += remaining;
    }
  });

  return totalDebt;
}

// Utility to sum ALL paid amounts regardless of type
function calculateTotalGenerado(ingresos: any[] | undefined): number {
  if (!ingresos || ingresos.length === 0) return 0;
  return ingresos
    .filter(ing => ing.estado === 'pagado')
    .reduce((acc, curr) => acc + (curr.monto || 0), 0);
}

export const ClienteService = {
  /**
   * Fetch all clients with summarized data (state and totals).
   */
  async getClientes(): Promise<Cliente[]> {
    const { data: clientes, error } = await supabase!
      .from('clientes')
      .select('*, ingresos(monto, estado, tipo), operaciones(estado)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clientes:', error.message);
      return [];
    }

    // Process data to include virtual fields for UI
    return (clientes || []).map(c => ({
      ...c,
      estado: c.operaciones?.[0]?.estado || 'viabilidad',
      total_generado: calculateTotalGenerado(c.ingresos),
      total_deuda: calculateNetDebt(c.ingresos)
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
      total_generado: calculateTotalGenerado(cliente.ingresos),
      total_deuda: calculateNetDebt(cliente.ingresos)
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
  async createCliente(
    data: Omit<Cliente, 'id' | 'created_at'> & {
      valor_subsidio?: number;
      descripcion_subsidio?: string
    }
  ): Promise<Cliente | null> {
    const { valor_subsidio, descripcion_subsidio, ...clienteData } = data;

    const { data: newCliente, error } = await supabase!
      .from('clientes')
      .insert([{
        ...clienteData,
        tipo_tramite: clienteData.tipo_tramite || 'banco'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating cliente:', error.message);
      throw error;
    }

    // Si es trámite de subsidio, creamos el registro de subsidio automáticamente
    if (clienteData.tipo_tramite === 'subsidio' && valor_subsidio) {
      await SubsidioService.create({
        cliente_id: newCliente.id,
        valor_total: valor_subsidio,
        descripcion: descripcion_subsidio || ''
      });
    }

    return newCliente;
  },

  /**
   * Delete a client by ID and all associated records (cascade delete).
   */
  async deleteCliente(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Obtener documentos para borrar archivos físicos del Storage
      const { data: docs } = await supabase.from('documentos').select('*').eq('cliente_id', id);
      if (docs && docs.length > 0) {
        for (const doc of docs) {
          await DocumentoService.deleteDocumento(doc as Documento);
        }
      }

      // 2. Eliminar ingresos/pagos asociados
      const { error: errIngresos } = await supabase!.from('ingresos').delete().eq('cliente_id', id);
      if (errIngresos) console.warn('Error borrando ingresos:', errIngresos.message);

      // 3. Eliminar operaciones asociadas
      const { error: errOps } = await supabase!.from('operaciones').delete().eq('cliente_id', id);
      if (errOps) console.warn('Error borrando operaciones:', errOps.message);

      // 4. Eliminar el cliente principal
      const { error } = await supabase!
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (err: any) {
      console.error(`Error deleting cliente ${id}:`, err.message);
      return {
        success: false,
        error: err.message || 'Hubo un problema al intentar eliminar el cliente y sus registros. Intenta nuevamente.'
      };
    }
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

