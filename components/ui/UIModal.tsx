'use client';

import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface UIModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function UIModal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }: UIModalProps) {
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0F0A4D]/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full ${maxWidth} transform overflow-hidden rounded-[40px] bg-white shadow-2xl transition-all animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-gray-100 flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-black text-[#0F0A4D] uppercase tracking-widest">{title}</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-10 py-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
