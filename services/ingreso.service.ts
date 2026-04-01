import { supabase } from '@/lib/supabase';
import type { Ingreso, EstadoIngreso } from '@/types';

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
   * Calculate summary stats for the Revenue Dashboard.
   */
  async getSummary() {
    const { data, error } = await supabase!
      .from('ingresos')
      .select('monto, estado');

    if (error) {
      console.error('Error fetching ingreso summary:', error.message);
      return { total: 0, pagado: 0, pendiente: 0 };
    }

    return (data || []).reduce((acc, curr) => {
      acc.total += curr.monto || 0;
      if (curr.estado === 'pagado') {
        acc.pagado += curr.monto || 0;
      } else {
        acc.pendiente += curr.monto || 0;
      }
      return acc;
    }, { total: 0, pagado: 0, pendiente: 0 });
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

    return newIngreso;
  },

  /**
   * Update payment status.
   */
  async updateStatus(id: string, estado: EstadoIngreso): Promise<boolean> {
    const { error } = await supabase!
      .from('ingresos')
      .update({ estado })
      .eq('id', id);

    if (error) {
      console.error(`Error updating ingreso status ${id}:`, error.message);
      return false;
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
