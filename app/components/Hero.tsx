'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image / Placeholder */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/page_facbook_kouami_atelier_danse_africaine.jpg"
          alt="Afro Danse Atelier"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 cinematic-overlay z-20" />
      </div>

      {/* Content */}
      <div className="relative z-30 text-center px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-accent font-bold tracking-widest uppercase mb-4 block">Unleash Your Spirit</span>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
            AFRO <span className="text-primary italic">DANZ</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-100/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the heartbeat of rhythm. Join our vibrant community and master the art of Afro movement.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-white font-bold rounded-full text-lg shadow-xl afro-gradient hover:brightness-110 transition-all w-full md:w-auto"
            >
              Start Dancing Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-full text-lg backdrop-blur-md hover:bg-white/10 transition-all w-full md:w-auto"
            >
              Explore Events
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements (Atmosphere) */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 w-24 h-24 border border-accent/20 rounded-full blur-sm"
      />
    </section>
  );
}
