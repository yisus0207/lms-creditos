// ============================================================
// OperacionService – Phase 4 (not implemented yet)
// ============================================================
import type { Operacion } from '@/types';

export const OperacionService = {
  async getAll(): Promise<Operacion[]> {
    return [];
  },

  async getByClienteId(_clienteId: string): Promise<Operacion[]> {
    return [];
  },

  async create(_data: Omit<Operacion, 'id'>): Promise<Operacion | null> {
    return null;
  },

  async updateEstado(
    _id: string,
    _estado: Operacion['estado']
  ): Promise<Operacion | null> {
    return null;
  },
};
