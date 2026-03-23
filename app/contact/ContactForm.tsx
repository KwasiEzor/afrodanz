'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { sendContactMessage } from '@/app/actions/contact';
import { motion, AnimatePresence } from 'framer-motion';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await sendContactMessage(formData);
    
    if (result.success) {
      setIsSent(true);
      // Reset after 5 seconds
      setTimeout(() => setIsSent(false), 5000);
      (e.target as HTMLFormElement).reset();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-slate-950 text-white p-10 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
      
      <h2 className="text-3xl font-black mb-8 uppercase tracking-tight relative z-10">
        Send a <span className="text-accent italic">Message</span>
      </h2>
      
      <AnimatePresence mode="wait">
        {isSent ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center py-12 space-y-4 relative z-10"
          >
            <CheckCircle2 className="w-20 h-20 text-green-500" />
            <h3 className="text-2xl font-black uppercase">Message Sent!</h3>
            <p className="text-slate-400 text-center">We&apos;ll get back to you faster than an Amapiano beat drop.</p>
          </motion.div>
        ) : (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-6 relative z-10"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">First Name</label>
                <input required name="firstName" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 ring-primary/50 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Last Name</label>
                <input required name="lastName" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 ring-primary/50 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <input required name="email" type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 ring-primary/50 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
              <textarea required name="message" rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 ring-primary/50 outline-none transition-all resize-none" />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-5 bg-white text-black font-black rounded-full shadow-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse flex items-center gap-2">
                  Sending...
                </span>
              ) : (
                <>Send Message <Send className="w-5 h-5" /></>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
