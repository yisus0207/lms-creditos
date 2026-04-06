import { supabase } from '@/lib/supabase';
import type { Ingreso, EstadoIngreso, EstadoOperacion } from '@/types';

export interface IngresoWithCliente extends Ingreso {
  cliente_nombre: string;
}

export const IngresoService = {
  /**
   * Fetch all revenue records with client names.
   */
  async getAll(): Promise<IngresoWithCliente[]> {
    const { data: ingresos, error } = await supabase!
      .from('ingresos')
      .select('*, clientes(nombre)')
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error fetching ingresos:', error.message);
      return [];
    }

    return (ingresos || []).map(i => ({
      ...i,
      cliente_nombre: i.clientes?.nombre || 'Desconocido'
    }));
  },

  /**
   * Calculate summary stats for the Revenue Dashboard using Net Debt logic.
   */
  async getSummary() {
    const { data, error } = await supabase!
      .from('ingresos')
      .select('monto, estado, tipo, cliente_id');

    if (error) {
      console.error('Error fetching ingreso summary:', error.message);
      return { total: 0, pagado: 0, pendiente: 0 };
    }

    // Step 1: Calculate total paid amount
    const pagado = (data || []).reduce((acc, curr) => {
      return curr.estado === 'pagado' ? acc + (curr.monto || 0) : acc;
    }, 0);

    // Step 2: Calculate true Net Debt grouped by client_id and type
    const pendingMap: Record<string, number> = {};
    const paidMap: Record<string, number> = {};

    (data || []).forEach(curr => {
      // Key format: clientId_type
      const key = `${curr.cliente_id}_${curr.tipo}`;
      const amount = curr.monto || 0;

      if (curr.estado === 'pendiente') {
         pendingMap[key] = (pendingMap[key] || 0) + amount;
      } else if (curr.estado === 'pagado') {
         paidMap[key] = (paidMap[key] || 0) + amount;
      }
    });

    let totalPending = 0;
    // Iterate over all unique pending keys to subtract any payments
    Object.keys(pendingMap).forEach(key => {
      const pending = pendingMap[key] || 0;
      const paid = paidMap[key] || 0;
      const remainingDebts = pending - paid;
      if (remainingDebts > 0) {
         totalPending += remainingDebts;
      }
    });

    return { 
      total: pagado + totalPending, // Projection is actual money in bank + realizable debt
      pagado: pagado, 
      pendiente: totalPending 
    };
  },

  /**
   * Register a new charge/payment.
   */
  async create(data: Omit<Ingreso, 'id'>): Promise<Ingreso | null> {
    const { data: newIngreso, error } = await supabase!
      .from('ingresos')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error creating ingreso:', error.message);
      return null;
    }

    // AUTOMATIZACIÓN: Sincronizar estado basado en el nuevo registro
    await this.syncClientStatus(data.cliente_id);

    return newIngreso;
  },

  /**
   * Update payment status.
   */
  async updateStatus(id: string, estado: EstadoIngreso): Promise<boolean> {
    // Obtenemos el ingreso para saber el cliente_id antes de actualizar
    const { data: ing } = await supabase!.from('ingresos').select('cliente_id').eq('id', id).single();

    const { error } = await supabase!
      .from('ingresos')
      .update({ estado })
      .eq('id', id);

    if (error) {
      console.error(`Error updating ingreso status ${id}:`, error.message);
      return false;
    }

    // Sincronizamos por si acaso (aunque la lógica actual es por registro, no por pago, mantenemos la consistencia)
    if (ing?.cliente_id) {
       await this.syncClientStatus(ing.cliente_id);
    }

    return true;
  },

  /**
   * Update an income record.
   */
  async update(id: string, data: Partial<Ingreso>): Promise<Ingreso | null> {
    const { data: updatedIngreso, error } = await supabase!
      .from('ingresos')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ingreso ${id}:`, error.message);
      return null;
    }

    // Si se cambió el tipo o el cliente, sincronizamos el estado
    if (updatedIngreso?.cliente_id) {
       await this.syncClientStatus(updatedIngreso.cliente_id);
    }

    return updatedIngreso;
  },

  /**
   * Sincroniza el estado de la operación del cliente basado en sus registros de ingresos.
   * La lógica es: el estado será la etapa MAS AVANZADA que tenga al menos un registro (pagado o pendiente).
   */
  async syncClientStatus(clientId: string): Promise<void> {
    const { data: ingresos } = await supabase!
      .from('ingresos')
      .select('tipo')
      .eq('cliente_id', clientId);

    if (!ingresos || ingresos.length === 0) return;

    const tipos = ingresos.map(i => i.tipo);
    
    let nuevoEstado: EstadoOperacion = 'viabilidad';
    
    // Jerarquía: comision (aprobado) > documentos > viabilidad
    if (tipos.includes('comision')) {
      nuevoEstado = 'aprobado';
    } else if (tipos.includes('documentos')) {
      nuevoEstado = 'documentos';
    } else {
      nuevoEstado = 'viabilidad';
    }

    // Actualizar o crear operación
    const { data: ops } = await supabase!.from('operaciones').select('id').eq('cliente_id', clientId).limit(1);

    if (ops && ops.length > 0) {
      await supabase!.from('operaciones').update({ estado: nuevoEstado }).eq('id', ops[0].id);
    } else {
      await supabase!.from('operaciones').insert([{
        cliente_id: clientId,
        estado: nuevoEstado,
        banco: 'PENDIENTE',
        monto_credito: 0
      }]);
    }
  },

  /**
   * Delete an income record.
   */
  async delete(id: string): Promise<boolean> {
    // Obtenemos el cliente_id antes de borrar
    const { data: ing } = await supabase!.from('ingresos').select('cliente_id').eq('id', id).single();
    
    const { error } = await supabase!
      .from('ingresos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting ingreso ${id}:`, error.message);
      return false;
    }

    // Sincronizamos el estado tras el borrado
    if (ing?.cliente_id) {
       await this.syncClientStatus(ing.cliente_id);
    }

    return true;
  },

  /**
   * Get ingresos for a specific client.
   */
  async getByClientId(clientId: string): Promise<Ingreso[]> {
    const { data, error } = await supabase!
      .from('ingresos')
      .select('*')
      .eq('cliente_id', clientId)
      .order('fecha', { ascending: false });

    if (error) {
      console.error(`Error fetching ingresos for client ${clientId}:`, error.message);
      return [];
    }

    return data || [];
  }
};
