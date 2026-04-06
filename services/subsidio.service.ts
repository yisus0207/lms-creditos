import { supabase } from '@/lib/supabase';
import type { Subsidio, AbonoSubsidio } from '@/types';

export const SubsidioService = {
  /**
   * Fetch all subsidios with client info and calculated abonos.
   */
  async getAll(): Promise<Subsidio[]> {
    const { data, error } = await supabase!
      .from('subsidios')
      .select('*, clientes(nombre, numero_documento), abonos_subsidio(monto)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subsidios:', error.message);
      return [];
    }

    return (data || []).map(s => {
      const abonos: number = (s.abonos_subsidio || []).reduce(
        (acc: number, ab: any) => acc + (ab.monto || 0),
        0
      );
      return {
        ...s,
        cliente_nombre: s.clientes?.nombre || 'Desconocido',
        cliente_cedula: s.clientes?.numero_documento || '-',
        total_abonos: abonos,
        pendiente: Math.max(0, (s.valor_total || 0) - abonos),
      };
    });
  },

  /**
   * Fetch a single subsidio with full abono history.
   */
  async getById(id: string): Promise<{ subsidio: Subsidio | null; abonos: AbonoSubsidio[] }> {
    const { data, error } = await supabase!
      .from('subsidios')
      .select('*, clientes(nombre, numero_documento), abonos_subsidio(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching subsidio detail:', error?.message);
      return { subsidio: null, abonos: [] };
    }

    const abonos: AbonoSubsidio[] = (data.abonos_subsidio || []).sort(
      (a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
    const totalAbonos = abonos.reduce((acc, ab) => acc + ab.monto, 0);

    return {
      subsidio: {
        ...data,
        cliente_nombre: data.clientes?.nombre || 'Desconocido',
        cliente_cedula: data.clientes?.numero_documento || '-',
        total_abonos: totalAbonos,
        pendiente: Math.max(0, (data.valor_total || 0) - totalAbonos),
      },
      abonos,
    };
  },

  /**
   * Create a new subsidio for a client.
   */
  async create(subsidio: { cliente_id: string; valor_total: number; descripcion?: string }): Promise<Subsidio | null> {
    const { data, error } = await supabase!
      .from('subsidios')
      .insert([{
        ...subsidio,
        descripcion: subsidio.descripcion?.toUpperCase() || ''
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating subsidio:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Add an abono (payment) to a subsidio.
   */
  async addAbono(abono: { subsidio_id: string; monto: number; fecha: string; observacion?: string }): Promise<AbonoSubsidio | null> {
    const { data, error } = await supabase!
      .from('abonos_subsidio')
      .insert([{
        ...abono,
        observacion: abono.observacion?.toUpperCase() || ''
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding abono:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Delete a subsidio and all its abonos (cascade handled by DB).
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase!
      .from('subsidios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subsidio:', error.message);
      return false;
    }
    return true;
  },

  /**
   * Update an existing subsidio.
   */
  async update(id: string, data: { valor_total?: number; descripcion?: string }): Promise<Subsidio | null> {
    const updateData = {
      ...data,
      descripcion: data.descripcion?.toUpperCase()
    };
    const { data: result, error } = await supabase!
      .from('subsidios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating subsidio:', error.message);
      return null;
    }
    return result;
  },

  /**
   * Quick summary for dashboard.
   */
  async getSummary() {
    const { data, error } = await supabase!
      .from('subsidios')
      .select('valor_total');

    if (error) {
      console.error('Error fetching subsidio summary:', error.message);
      return { total: 0 };
    }

    const total = (data || []).reduce((acc, curr) => acc + (curr.valor_total || 0), 0);
    return { total };
  },
};
