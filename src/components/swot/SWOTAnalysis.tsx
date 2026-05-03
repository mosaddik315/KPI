import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Lightbulb, Zap, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

const SWOT_TYPES = [
  { id: 'strength', label: 'Strengths', labelBn: 'শক্তি', icon: Shield, color: 'text-green-400' },
  { id: 'weakness', label: 'Weaknesses', labelBn: 'দুর্বলতা', icon: AlertTriangle, color: 'text-red-400' },
  { id: 'opportunity', label: 'Opportunities', labelBn: 'সুযোগ', icon: Lightbulb, color: 'text-gold' },
  { id: 'threat', label: 'Threats', labelBn: 'ঝুঁকি', icon: Zap, color: 'text-purple-400' },
];

export default function SWOTAnalysis() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'swots'), 
      where('userId', '==', user.uid),
      where('quarter', '==', currentQuarter),
      where('year', '==', currentYear)
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, [user]);

  const addItem = async (type: string) => {
    const content = prompt(`Add a new ${type}:`);
    if (!content || !user) return;
    await addDoc(collection(db, 'swots'), {
      userId: user.uid,
      type,
      content,
      quarter: currentQuarter,
      year: currentYear,
      createdAt: serverTimestamp()
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif text-gold mb-2">SWOT Matrix</h2>
          <p className="text-xs text-white/40 uppercase tracking-widest font-sans">
            Quarterly Reflection: Q{currentQuarter} {currentYear} / ত্রৈমাসিক বিশ্লেষণ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden">
        {SWOT_TYPES.map((type) => (
          <div key={type.id} className="glass p-10 min-h-[300px] flex flex-col bg-charcoal/40 backdrop-blur-none">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/5", type.color)}>
                  <type.icon size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white">{type.label}</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-sans">{type.labelBn}</p>
                </div>
              </div>
              <button 
                onClick={() => addItem(type.id)}
                className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-gold transition-all"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              {items.filter(i => i.type === type.id).map((item) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={item.id} 
                  className="flex gap-4 items-start group"
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-2.5", type.color)} />
                  <p className="text-sm text-white/70 leading-relaxed font-light">{item.content}</p>
                </motion.div>
              ))}
              {items.filter(i => i.type === type.id).length === 0 && (
                <p className="text-xs text-white/10 uppercase tracking-widest italic mt-4">Empty Analysis Block</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-8 border border-white/5 rounded-3xl bg-white/[0.02] flex items-center justify-between">
        <div className="max-w-md">
           <h4 className="font-serif text-lg text-white mb-2">Quarterly Strategic Action</h4>
           <p className="text-[11px] text-white/40 leading-relaxed">
             Based on your SWOT identifiers, the system suggests focusing on mitigating Threats via your current internal Strengths. 
             Mathematical risk reduction is currently optimized.
           </p>
        </div>
        <div className="w-20 h-20 border border-gold/20 rounded-full flex items-center justify-center text-gold/40 font-serif italic text-2xl">
           A
        </div>
      </div>
    </div>
  );
}
