import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass max-w-md w-full p-12 rounded-[2rem] border border-gold/20 flex flex-col items-center relative z-10"
      >
        <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center shadow-2xl shadow-gold/30 mb-8">
          <span className="font-serif font-bold text-charcoal text-4xl">A</span>
        </div>
        
        <h1 className="font-serif text-3xl text-gold mb-2 tracking-tight">Aureus Growth</h1>
        <p className="text-sm text-white/50 mb-12 text-center uppercase tracking-[0.2em] font-sans">
          Personal KPI & Growth Management /<br />
          ব্যক্তিগত কেপিআই এবং উন্নতি ব্যবস্থাপনা
        </p>
        
        <button 
          onClick={signIn}
          className="w-full flex items-center justify-center gap-4 bg-white text-charcoal py-4 rounded-xl font-bold hover:bg-gold transition-all duration-500 group shadow-xl shadow-white/5"
        >
          <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
          Join the Elite / লগইন করুন
        </button>
        
        <p className="mt-12 text-[10px] text-white/20 text-center leading-relaxed">
          BY ENTERING, YOU AGREE TO OUR TERMS OF GROWTH.<br />
          MATHEMATICALLY OPTIMIZED FOR YOUR SUCCESS.
        </p>
      </motion.div>
    </div>
  );
}
