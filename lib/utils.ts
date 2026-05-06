// ============================================================
// LMS Créditos – Shared utilities
// ============================================================

/**
 * Merges class names, filtering falsy values.
 * Lightweight alternative to clsx for now.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a number as Colombian peso currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string to locale readable format.
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

/**
 * Truncate a string to a given length, adding ellipsis.
 */
export function truncate(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
}

/**
 * Format a number as compact currency for mobile.
 * e.g. 1200000 → $1.2M | 450000 → $450k | 8500 → $8.5k
 */
export function formatCompact(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `$${Math.round(amount / 1_000)}k`;
  if (abs >= 1_000) return `$${(amount / 1_000).toFixed(1)}k`;
  return `$${Math.round(amount)}`;
}
