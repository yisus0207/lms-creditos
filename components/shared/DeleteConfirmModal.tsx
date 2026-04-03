'use client';

import React from 'react';
import { X, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Sí, eliminar permanentemente",
  cancelText = "No, mantenerlo",
  isLoading = false
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0F0A4D]/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[40px] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 rounded-[28px] bg-rose-50 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <TriangleAlert className="w-10 h-10 text-rose-500" />
        </div>

        <h3 className="text-2xl font-black text-[#0B1E3F] text-center mb-2 tracking-tight">
          {title}
        </h3>
        
        <div className="text-sm text-gray-400 text-center mb-8 leading-relaxed px-2">
          {description}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-4 rounded-[22px] bg-rose-500 text-white font-black hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-4 rounded-[22px] bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
