import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { FIBONACCI, cn } from '../../lib/utils';

// Fibonacci focusing on common deep work values
const FIB_OPTIONS = [21, 34, 55];

export default function FibonacciTimer() {
  const [minutes, setMinutes] = useState(34);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(34 * 60);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          clearInterval(interval);
          // TODO: Play notification sound
          if (Notification.permission === 'granted') {
            new Notification('Session Complete', { body: 'Deep work session finished.' });
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setMinutes(initialTime / 60);
    setSeconds(0);
  };

  const selectTime = (min: number) => {
    setIsActive(false);
    setMinutes(min);
    setSeconds(0);
    setInitialTime(min * 60);
  };

  const progress = 1 - (minutes * 60 + seconds) / initialTime;

  return (
    <div className="glass rounded-3xl p-8 border border-gold/10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-serif text-xl text-gold">Deep Work Timer</h3>
          <p className="text-xs text-white/40 uppercase tracking-widest font-sans">Fibonacci Focus / ফোকাস টাইমার</p>
        </div>
        <Timer className="text-gold opacity-50" />
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* Timer Display */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-white/5"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-gold"
              initial={{ strokeDasharray: "553 553", strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 * (1 - progress) }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-light text-white tracking-tighter">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Fibonacci Presets */}
        <div className="flex gap-4">
          {FIB_OPTIONS.map((min) => (
            <button
              key={min}
              onClick={() => selectTime(min)}
              className={cn(
                "w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500",
                initialTime === min * 60 
                  ? "bg-gold border-gold text-charcoal shadow-lg shadow-gold/20" 
                  : "border-white/10 text-white/60 hover:border-gold/50"
              )}
            >
              <span className="font-serif text-xs font-bold">{min}</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={reset}
            className="p-3 rounded-full hover:bg-white/5 transition-colors text-white/40"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={toggle}
            className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all duration-500"
          >
            {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>
    </div>
  );
}
