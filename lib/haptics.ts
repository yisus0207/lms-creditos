'use client';

/**
 * Utilidad Premium para feedback háptico (vibración sutil) en dispositivos móviles.
 * Inspirado en la experiencia táctil de iOS y Android.
 */
export const Haptics = {
  /**
   * Vibración corta y sutil para acciones exitosas (como guardar un formulario).
   */
  light: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(15);
    }
  },

  /**
   * Vibración doble sutil para advertencias o selecciones importantes.
   */
  medium: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([15, 30, 15]);
    }
  },

  /**
   * Vibración más marcada para errores o acciones críticas (como eliminar).
   */
  heavy: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  },

  /**
   * Patrón de éxito tipo "confirmación" (doble toque rápido).
   */
  success: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([20, 50, 20]);
    }
  }
};
