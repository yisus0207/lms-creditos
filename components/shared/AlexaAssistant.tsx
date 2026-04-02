'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  X, 
  MessageCircle, 
  Bot, 
  User,
  Minimize2,
  Trash2,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { alexaService, ChatMessage } from '@/services/alexa.service';

export default function AlexaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await alexaService.sendMessage([...messages, userMessage]);
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Alexa Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            className="w-[380px] h-[550px] bg-[#0F0A4D]/80 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col pointer-events-auto ring-1 ring-white/10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-gradient-to-r from-[#D4A017]/20 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4A017] to-[#F1C40F] flex items-center justify-center shadow-[0_0_15px_rgba(212,160,23,0.4)]">
                  <Bot className="w-6 h-6 text-[#0F0A4D]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">Alexa Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">En Línea • Inteligencia Deep</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearChat} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-rose-500/20 rounded-full transition-colors text-white/60 hover:text-rose-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-2">
                    <Sparkles className="w-8 h-8 text-[#D4A017] opacity-40" />
                  </div>
                  <p className="text-white/80 font-medium text-sm">
                    ¡Hola! Soy Alexa. <br/>
                    <span className="text-white/40 text-xs font-normal">¿En qué puedo ayudarte hoy con la gestión de créditos?</span>
                  </p>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {[
                      "¿Cómo va el pipeline de este mes?",
                      "Dime el estado de Juan Perez",
                      "¿Qué deudas tenemos pendientes?"
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-[11px] text-white/50 bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/5 transition-all text-left hover:text-[#D4A017]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "flex gap-3",
                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    m.role === 'user' ? "bg-white/10" : "bg-[#D4A017]/20"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4 text-white/60" /> : <Bot className="w-4 h-4 text-[#D4A017]" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-lg",
                    m.role === 'user' 
                      ? "bg-white/10 text-white rounded-tr-none" 
                      : "bg-[#1A1560] text-white/90 border border-white/5 rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4A017]/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#D4A017] animate-pulse" />
                  </div>
                  <div className="bg-[#1A1560] p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 bg-black/20 border-t border-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe a Alexa..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4A017]/50 focus:ring-1 focus:ring-[#D4A017]/50 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#D4A017] hover:bg-[#F1C40F] disabled:bg-white/10 disabled:text-white/20 text-[#0F0A4D] rounded-xl transition-all shadow-lg active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="mt-2 text-[9px] text-center text-white/20 uppercase font-medium tracking-tighter">
                Acceso a base de datos cifrado y seguro
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-[#0F0A4D] to-[#1A1560] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center text-[#D4A017] hover:text-white transition-colors pointer-events-auto relative group"
      >
        <div className="absolute inset-0 rounded-[24px] bg-[#D4A017]/10 animate-ping group-hover:hidden opacity-20" />
        {isOpen ? <Minimize2 className="w-7 h-7" /> : <MessageCircle className="w-8 h-8" />}
      </motion.button>
    </div>
  );
}
