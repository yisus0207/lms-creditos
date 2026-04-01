'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'info' | 'error' | 'warning' | 'success';
}

export default function Modal({ isOpen, onClose, onConfirm, title, children, variant = 'info' }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const variantStyles = {
    info: 'border-blue-100 bg-blue-50 text-blue-800',
    error: 'border-red-100 bg-red-50 text-red-800',
    warning: 'border-amber-100 bg-amber-50 text-amber-800',
    success: 'border-emerald-100 bg-emerald-50 text-emerald-800',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0F0A4D]/40 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md scale-100 transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="flex flex-col items-center text-center">
          {/* Icon Circle */}
          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${variantStyles[variant]} shadow-sm`}>
             {variant === 'error' || variant === 'warning' ? (
               <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             )}
          </div>

          <h3 className="mb-2 text-xl font-bold text-[#0F0A4D]">{title}</h3>
          <div className="mb-8 text-sm text-gray-500 leading-relaxed">
            {children}
          </div>

          {/* Footer Actions */}
          <div className="flex w-full gap-3">
             <Button 
                onClick={onClose} 
                className={`flex-1 transition-all ${
                  variant === 'info' || variant === 'success' 
                  ? 'bg-[#0F0A4D]' 
                  : 'bg-white !text-[#0F0A4D] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {variant === 'warning' ? 'Cancelar' : 'Entendido'}
              </Button>
              
              {variant === 'warning' && (
                <Button 
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    onClose();
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 !text-white"
                >
                  Confirmar
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
