import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import TodaySnapshot from './components/dashboard/TodaySnapshot';
import KPIOverview from './components/dashboard/KPIOverview';
import GrowthEngine from './components/growth/GrowthEngine';
import SWOTAnalysis from './components/swot/SWOTAnalysis';
import FibonacciTimer from './components/timer/FibonacciTimer';
import Login from './components/auth/Login';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, Coffee } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWorkMode, setIsWorkMode] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 border-2 border-gold rounded-full"
        />
      </div>
    );
  }

  if (!user) return <Login />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2 space-y-12">
              <TodaySnapshot />
              <KPIOverview />
            </div>
            <div className="space-y-12">
              <FibonacciTimer />
              
              {/* Active Task / Idle Tracker Component */}
              <div className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-serif text-xl text-white">Utilization</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-sans">Active vs Idle / সক্রিয়তা</p>
                  </div>
                  <button 
                    onClick={() => setIsWorkMode(!isWorkMode)}
                    className={`p-3 rounded-xl transition-all duration-500 flex items-center gap-3 ${
                      isWorkMode ? 'bg-gold text-charcoal' : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {isWorkMode ? <Play size={18} fill="currentColor" /> : <Coffee size={18} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{isWorkMode ? 'Active' : 'Idle'}</span>
                  </button>
                </div>
                
                <div className="flex items-end gap-1 h-24 mb-6">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.random() * 80 + 20}%` }}
                      className={`flex-1 rounded-t-sm ${i > 18 ? 'bg-gold/60' : 'bg-gold/10'}`}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-[11px] text-white/30 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Clock size={12} className="text-gold" /> 6.5h Targeted</span>
                  <span>Daily Cap: 8h</span>
                </div>
              </div>

              {/* Quick Quote */}
              <div className="p-8 border-l-2 border-gold/30 bg-gold/5 italic text-sm text-gold/80 leading-relaxed font-serif">
                "Disciplined growth is the only exponential path that is sustainable in the long-term Aureus trajectory."
              </div>
            </div>
          </div>
        );
      case 'kpis':
        return <KPIOverview />;
      case 'growth':
        return <GrowthEngine />;
      case 'swot':
        return <SWOTAnalysis />;
      case 'time':
        return (
          <div className="max-w-4xl mx-auto space-y-12">
             <TodaySnapshot />
             {/* Time specifics can go here */}
             <div className="glass p-12 rounded-[2rem] text-center border border-white/5">
                <Clock className="mx-auto text-gold/20 mb-6" size={48} />
                <h3 className="font-serif text-2xl text-white mb-2">Temporal Audits Coming</h3>
                <p className="text-white/40 font-light">Detailed log visualization is currently being calibrated for Q2.</p>
             </div>
          </div>
        );
      default:
        return <TodaySnapshot />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
