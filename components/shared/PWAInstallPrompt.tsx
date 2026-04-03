'use client';

import { useState, useEffect } from 'react';
import UIModal from '@/components/ui/UIModal';
import Button from '@/components/ui/Button';
import { Download, Monitor, Smartphone, Sparkles } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Detect if the app is already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone || 
                        document.referrer.includes('android-app://');

    if (isStandalone) return;

    // 2. Check if user already dismissed the prompt recently
    const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) {
      const dismissTime = parseInt(isDismissed, 10);
      const now = Date.now();
      // Only show again after 7 days if dismissed
      if (now - dismissTime < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the premium modal
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
      localStorage.setItem('pwa_installed', 'true');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <UIModal
      isOpen={showPrompt}
      onClose={handleDismiss}
      title="Instalar LMS Créditos"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center py-6">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#D4A017] rounded-[32px] blur-2xl opacity-20 animate-pulse" />
          <div className="relative w-32 h-32 bg-gradient-to-br from-[#0F0A4D] to-[#1a136d] rounded-[32px] flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden">
             <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-gray-100">
            <Sparkles className="w-5 h-5 text-[#D4A017]" />
          </div>
        </div>

        <h3 className="text-2xl font-black text-[#0F0A4D] mb-3">
          Experiencia de Escritorio
        </h3>
        
        <p className="text-gray-500 font-medium leading-relaxed mb-8 px-4">
          Instala la aplicación para acceder más rápido, navegar sin distracciones y recibir notificaciones en tiempo real.
        </p>

        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <Monitor className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Para PC / Mac</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <Smartphone className="w-6 h-6 text-green-500 mb-2" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Para Celulares</span>
          </div>
        </div>

        <Button 
          onClick={handleInstall}
          className="w-full h-14 rounded-2xl bg-[#D4A017] text-[#0F0A4D] font-black text-lg shadow-xl shadow-amber-900/20 gap-3 group"
        >
          <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          Instalar Ahora
        </Button>
        
        <button 
          onClick={handleDismiss}
          className="mt-6 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors underline decoration-gray-200 underline-offset-4"
        >
          Quizás más tarde
        </button>
      </div>
    </UIModal>
  );
}
