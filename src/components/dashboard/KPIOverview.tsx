import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Plus, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KPI {
  id: string;
  title: string;
  type: 'today' | 'week' | 'month' | 'year';
  targetValue: number;
  currentValue: number;
  unit: string;
  category: string;
}

export default function KPIOverview() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'month' | 'year'>('today');

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'kpis'), 
      where('userId', '==', user.uid),
      where('type', '==', activeFilter)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KPI));
      setKpis(docs);
    });
    return unsubscribe;
  }, [user, activeFilter]);

  const updateProgress = async (id: string, current: number, target: number) => {
    if (current >= target) return;
    const kpiRef = doc(db, 'kpis', id);
    await updateDoc(kpiRef, {
      currentValue: current + 1,
      updatedAt: serverTimestamp()
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif text-gold mb-2">KPI Performance</h2>
          <p className="text-xs text-white/40 uppercase tracking-widest font-sans">Hierarchical Targets / লক্ষ্যবস্তু ট্র্যাকিং</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          {(['today', 'week', 'month', 'year'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs uppercase tracking-widest transition-all duration-300",
                activeFilter === filter ? "bg-gold text-charcoal font-bold" : "text-white/40 hover:text-white"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kpis.map((kpi) => {
          const progress = (kpi.currentValue / kpi.targetValue) * 100;
          return (
            <motion.div
              layout
              key={kpi.id}
              className="glass p-8 rounded-3xl border border-white/5 group hover:border-gold/30 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] text-gold/60 uppercase tracking-[0.2em] font-sans mb-2 block">{kpi.category}</span>
                  <h3 className="text-xl font-serif text-white group-hover:text-gold transition-colors">{kpi.title}</h3>
                </div>
                {progress >= 100 ? (
                  <div className="text-green-400"><CheckCircle2 size={24} /></div>
                ) : (
                  <button 
                    onClick={() => updateProgress(kpi.id, kpi.currentValue, kpi.targetValue)}
                    className="text-white/20 hover:text-gold transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40 italic">Progress: {Math.round(progress)}%</span>
                  <span className="text-white/80 font-mono">{kpi.currentValue} / {kpi.targetValue} {kpi.unit}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={cn(
                      "h-full transition-all duration-1000",
                      progress >= 100 ? "bg-green-400" : "bg-gradient-to-r from-gold to-gold-light"
                    )}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add New KPI Placeholder */}
        <button className="border-2 border-dashed border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-white/20 hover:border-gold/30 hover:text-gold transition-all duration-500 group">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold">Initiate New Target / নতুন লক্ষ্য</span>
        </button>
      </div>

      {kpis.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center border border-white/5 rounded-[2rem] bg-white/[0.02]">
           <Trophy size={48} className="text-white/5 mb-6" />
           <p className="font-serif text-white/40 text-lg">No active targets in this timeframe</p>
           <p className="text-[10px] text-white/20 uppercase tracking-widest mt-2">Start your growth sequence today</p>
        </div>
      )}
    </div>
  );
}
