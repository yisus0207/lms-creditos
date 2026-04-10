import { supabase } from '@/lib/supabase';
import type { Gasto } from '@/types';

export const GastoService = {
  async getAll(): Promise<Gasto[]> {
    const { data, error } = await supabase!
      .from('gastos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error fetching gastos:', error.message);
      return [];
    }
    return (data || []) as Gasto[];
  },

  async create(payload: Omit<Gasto, 'id' | 'created_at'>): Promise<Gasto | null> {
    const { data, error } = await supabase!
      .from('gastos')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error creating gasto:', error.message);
      throw error;
    }
    return data as Gasto;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('gastos').delete().eq('id', id);
    if (error) {
      console.error('Error deleting gasto:', error.message);
      return false;
    }
    return true;
  },

  async update(id: string, payload: Partial<Gasto>): Promise<Gasto | null> {
    const { data, error } = await supabase
      .from('gastos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating gasto:', error.message);
      throw error;
    }
    return data as Gasto;
  },
};
