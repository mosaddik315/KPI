import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, TrendingUp, Calendar, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

export default function TodaySnapshot() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate day progress (0 to 1) based on standard 24h
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
  const dayProgress = (now.getTime() - startOfDay) / (endOfDay - startOfDay);

  const hoursRemaining = 24 * (1 - dayProgress);

  const requestNotifications = () => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Alerts Enabled', { body: 'Aureus Growth will now notify you of KPI deadlines.' });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {/* Time Snapshot */}
      <div className="glass rounded-3xl p-8 col-span-2 flex flex-col justify-between border border-gold/10 overflow-hidden relative group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-all duration-1000" />
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-5xl font-serif text-white tracking-tighter mb-2">
              {format(now, 'hh:mm')}
              <span className="text-xl text-gold/60 ml-2 font-light uppercase tracking-widest">{format(now, 'aa')}</span>
            </h2>
            <p className="font-serif text-gold/80 italic text-lg">{format(now, 'EEEE, do MMMM')}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={requestNotifications}
              className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-gold/10 transition-colors group"
              title="Enable Notifications / নোটিফিকেশন"
            >
              <Zap className="text-gold group-hover:scale-110 transition-transform" size={24} />
            </button>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <Calendar className="text-gold" size={24} />
            </div>
          </div>
        </div>

        <div className="mt-12 relative z-10">
          <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-white/40 font-sans mb-3">
            <span>Day Progress / আজকের অগ্রগতি</span>
            <span className="text-gold">{Math.round(dayProgress * 100)}%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${dayProgress * 100}%` }}
              className="h-full bg-gradient-to-r from-gold to-gold-light"
            />
          </div>
          <p className="mt-4 text-[11px] text-white/30 uppercase tracking-widest flex items-center gap-2">
            <Clock size={12} className="text-gold/40" />
            Time remaining for daily tasks: <span className="text-white/60">{Math.floor(hoursRemaining)}h {Math.round((hoursRemaining % 1) * 60)}m</span>
          </p>
        </div>
      </div>

      {/* Quick Stats Widget */}
      <div className="glass rounded-3xl p-8 border border-white/5 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gold/10 rounded-xl">
            <Zap className="text-gold" size={20} />
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-sans">Productivity Level</p>
            <p className="font-serif text-lg text-white">Peak Efficiency</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0">
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Growth Score: +12%</p>
              <p className="text-[10px] text-white/30">Compared to last week</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0">
              <Clock size={16} className="text-gold" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">3.5h Deep Work</p>
              <p className="text-[10px] text-white/30">Today's focused time</p>
            </div>
          </div>
        </div>

        <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-charcoal transition-all duration-300 font-bold">
          Full Analysis / বিশ্লেষণ
        </button>
      </div>
    </div>
  );
}
