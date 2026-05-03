import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Target, 
  Clock, 
  BookOpen, 
  Compass, 
  TrendingUp, 
  LogOut,
  User as UserIcon,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface NavItem {
  id: string;
  label: string;
  labelBn: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: LayoutDashboard },
  { id: 'kpis', label: 'KPI Tracker', labelBn: 'কেপিআই ট্র্যাকার', icon: Target },
  { id: 'time', label: 'Time Logs', labelBn: 'সময় ট্র্যাকার', icon: Clock },
  { id: 'growth', label: 'Growth Engine', labelBn: 'উন্নতি ইঞ্জিন', icon: TrendingUp },
  { id: 'swot', label: 'SWOT Analysis', labelBn: 'সোয়াট বিশ্লেষণ', icon: Compass },
];

export default function DashboardLayout({ 
  children, 
  activeTab, 
  setActiveTab 
}: { 
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  // Golden Ratio sidebar width: approx 38.2% on desktop if we follow 1:1.618
  // But for a typical app, let's use a fixed width that feels premium, 
  // or a responsive one that adheres to the ratio.
  
  return (
    <div className="min-h-screen bg-charcoal flex overflow-hidden">
      {/* Sidebar - Golden Ratio Proportioned */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? '380px' : '80px' }}
        className="h-screen glass border-r border-gold/20 flex flex-col z-50 shrink-0"
      >
        <div className="p-8 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/20">
                  <span className="font-serif font-bold text-charcoal text-xl">A</span>
                </div>
                <div>
                  <h1 className="font-serif text-lg leading-none tracking-tight text-gold">AUREUS</h1>
                  <p className="text-[10px] text-gold/60 uppercase tracking-[0.2em] mt-1 font-sans">Growth Tracker</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gold/80"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group relative",
                activeTab === item.id 
                  ? "bg-gold text-charcoal shadow-xl shadow-gold/10" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={22} className={cn("shrink-0", activeTab === item.id ? "text-charcoal" : "group-hover:text-gold transition-colors")} />
              {isSidebarOpen && (
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-sm">{item.label}</span>
                  <span className="text-[10px] opacity-60 font-sans tracking-wide">{item.labelBn}</span>
                </div>
              )}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-charcoal rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          {user && (
            <div className={cn("flex flex-col gap-4", isSidebarOpen ? "items-stretch" : "items-center")}>
              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-full border border-gold/30 bg-slate overflow-hidden flex items-center justify-center">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={20} className="text-gold" />
                  )}
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate font-serif">{user.displayName || 'User'}</p>
                    <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                  </div>
                )}
              </div>
              <button 
                onClick={logout}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all",
                  !isSidebarOpen && "justify-center"
                )}
              >
                <LogOut size={20} />
                {isSidebarOpen && <span className="font-medium text-sm">Logout / লগআউট</span>}
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content - Adhering to Golden Ratio Proportion */}
      <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-charcoal to-slate relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />
        <div className="p-12 relative z-10 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
