// ============================================================
// LMS Créditos – Auth helpers (Phase 3 – not implemented yet)
// ============================================================
// Will use Supabase Auth in Phase 3.
// Roles: admin | cliente

export type UserRole = 'admin' | 'cliente';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Placeholder – returns null until auth is implemented.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  return null;
}

/**
 * Placeholder – always returns false until auth is implemented.
 */
export async function isAuthenticated(): Promise<boolean> {
  return false;
}
