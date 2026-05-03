import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Book, Target, Award, Plus, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function GrowthEngine() {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const qBooks = query(collection(db, 'books'), where('userId', '==', user.uid));
    const unsubBooks = onSnapshot(qBooks, (snap) => {
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qSkills = query(collection(db, 'skills'), where('userId', '==', user.uid));
    const unsubSkills = onSnapshot(qSkills, (snap) => {
      setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubBooks(); unsubSkills(); };
  }, [user]);

  return (
    <div className="space-y-16">
      {/* Books Tracker */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif text-gold mb-2">Book Tracker</h2>
            <p className="text-xs text-white/40 uppercase tracking-widest font-sans">Literature for Growth / জ্ঞান বৃদ্ধি</p>
          </div>
          <Book className="text-gold/20" size={32} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {books.map(book => {
            const progress = (book.pagesRead / book.totalPages) * 100;
            return (
              <div key={book.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-white mb-1">{book.title}</h3>
                  <p className="text-xs text-white/40 mb-6 italic">by {book.author}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                    <span>{Math.round(progress)}% Complete</span>
                    <span>{book.pagesRead} / {book.totalPages} pp</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <button className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex items-center justify-center gap-3 text-white/20 hover:border-gold/30 hover:text-gold transition-all duration-300">
            <Plus size={20} />
            <span className="text-xs uppercase tracking-widest font-bold">Add to Library</span>
          </button>
        </div>
      </section>

      {/* Skill Mastery */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif text-gold mb-2">Skill Mastery</h2>
            <p className="text-xs text-white/40 uppercase tracking-widest font-sans">Technical Excellence / দক্ষতা অর্জন</p>
          </div>
          <Layers className="text-gold/20" size={32} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map(skill => {
            const progress = (skill.currentHours / skill.targetHours) * 100;
            return (
              <div key={skill.id} className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                   <Target size={40} className="text-gold/5 group-hover:text-gold/10 transition-all duration-700" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">{skill.name}</h3>
                <p className="text-xs text-white/30 uppercase tracking-widest mb-8">{skill.description}</p>
                
                <div className="flex items-end gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-3xl font-light text-gold">{skill.currentHours}<span className="text-xs text-white/20 ml-1">hrs</span></span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">Target: {skill.targetHours}h</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gold"
                      />
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl border border-gold/20 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-gold">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
          <button className="border-2 border-dashed border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-white/20 hover:border-gold/30 hover:text-gold transition-all duration-300">
             <Award size={32} />
             <span className="text-xs uppercase tracking-widest font-bold">Forge New Skill</span>
          </button>
        </div>
      </section>
    </div>
  );
}
