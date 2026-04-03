'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HardHat, Hammer, Home, Sparkles, Smile } from 'lucide-react';

export default function BancosPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-black text-[#0F0A4D]">Bancos</h1>
        <p className="text-gray-500 mt-1">Gestión de entidades financieras y productos</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[65vh] overflow-hidden relative">
        
        {/* Adorable Animation Container */}
        <div className="relative w-72 h-64 mb-6 flex items-end justify-center pointer-events-none">
          
          {/* Background sparkles */}
          <motion.div
            animate={{ rotate: 15, scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-4 text-[#D4A017]/30"
          >
            <Sparkles size={48} />
          </motion.div>

          {/* Faded house shadow/blueprint */}
          <motion.div
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-4 right-12 z-0 opacity-20"
          >
             <Home size={140} strokeWidth={1} color="#0F0A4D" />
          </motion.div>

          {/* Solid house building effect */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute bottom-4 right-12 w-[140px] overflow-hidden flex items-end z-10"
          >
             <Home size={140} strokeWidth={1.5} color="#0F0A4D" fill="#e0e7ff" className="shrink-0" />
          </motion.div>

          {/* The Cute Person */}
          <motion.div 
             animate={{ y: [-3, 3, -3] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-4 left-10 flex flex-col items-center z-20"
          >
            {/* HardHat on top */}
            <motion.div 
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#D4A017] -mb-3 z-10 relative left-1"
            >
              <HardHat size={56} strokeWidth={2} fill="#fef08a" />
            </motion.div>

            {/* Face/Person */}
            <div className="text-[#0F0A4D] bg-white rounded-full p-2 border-4 border-[#0F0A4D] shadow-sm relative">
              <Smile size={44} strokeWidth={2.5} />
              
              {/* Cute flushed cheeks */}
              <div className="absolute top-6 left-2 w-2 h-2 bg-pink-300 rounded-full opacity-60"></div>
              <div className="absolute top-6 right-2 w-2 h-2 bg-pink-300 rounded-full opacity-60"></div>
            </div>

            {/* Arm with Hammer */}
            <motion.div 
              animate={{ rotate: [0, -60, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeOut" }}
              style={{ originX: 0, originY: 1 }}
              className="absolute top-14 -right-12 text-[#0F0A4D]"
            >
              <Hammer size={38} strokeWidth={2} fill="#e2e8f0" />
            </motion.div>

          </motion.div>
          
          {/* Floating tiny sparkles indicating work */}
          <motion.div
             animate={{ y: -30, opacity: [0, 1, 0], x: 20 }}
             transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
             className="absolute bottom-20 left-32 text-[#D4A017]"
          >
             <Sparkles size={16} />
          </motion.div>

        </div>

        {/* Text Area */}
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-black text-[#0F0A4D] mb-4"
        >
          ¡En preparación!
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-500 max-w-md mx-auto"
        >
          Estamos construyendo este módulo con mucho amor. Muy pronto podrás gestionar aquí todas las relaciones bancarias de tus clientes.
        </motion.p>
        
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="mt-8"
        >
           <div className="inline-flex items-center justify-center px-6 py-2 bg-[#0F0A4D]/5 text-[#0F0A4D] rounded-full font-bold text-sm">
             Disponible próximamente 🚧
           </div>
        </motion.div>

      </div>
    </div>
  );
}
