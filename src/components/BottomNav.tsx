import { Calendar, LayoutGrid, CheckSquare, Gift, Swords } from 'lucide-react';
import { QuestType } from '../types';

interface BottomNavProps {
  isDarkMode: boolean; // Determines the active styling theme
  filter: QuestType | 'all' | 'archived' | 'rewards'; // Currently active view
  setFilter: (f: QuestType | 'all' | 'archived' | 'rewards') => void; // Updates the active view
  onAddQuest: () => void; // Callback to open the Add Quest modal
}

/**
 * BottomNav component handles navigation between different quest views (Habits, Dailies, To Do's)
 * and the Rewards view. Also contains the central FAB to add new quests.
 */
export default function BottomNav({ isDarkMode, filter, setFilter, onAddQuest }: BottomNavProps) {
  return (
    // Fixed navigation bar pinned to the bottom (mobile) or floating (desktop)
    <nav className={`absolute md:fixed md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-[600px] md:max-w-full md:rounded-3xl bottom-0 w-full px-2 md:px-8 py-2 flex items-center justify-between pb-8 pt-4 md:pb-2 md:pt-2 sm:rounded-b-[2rem] border shrink-0 z-20 transition-colors shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/80 text-slate-400 border-slate-700/50 border-t-slate-600' : 'bg-white/90 text-slate-500 border-slate-200 border-t-white'}`}>
      
      {/* Dailies Tab */}
      <button 
        onClick={() => setFilter('daily')}
        className={`flex-1 flex flex-col items-center gap-1.5 transition-all duration-300 ${filter === 'daily' ? (isDarkMode ? 'text-amber-400 -translate-y-1' : 'text-emerald-600 -translate-y-1') : (isDarkMode ? 'hover:text-slate-200' : 'hover:text-slate-800')}`}
      >
        <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 drop-shadow-sm" />
        <span className="text-[10px] font-bold font-heading tracking-widest uppercase">Dailies</span>
      </button>

      {/* Scheduled Habits Tab */}
      <button 
        onClick={() => setFilter('scheduled')}
        className={`flex-1 flex flex-col items-center gap-1.5 transition-all duration-300 ${filter === 'scheduled' ? (isDarkMode ? 'text-amber-400 -translate-y-1' : 'text-emerald-600 -translate-y-1') : (isDarkMode ? 'hover:text-slate-200' : 'hover:text-slate-800')}`}
      >
        <Calendar className="w-5 h-5 md:w-6 md:h-6 drop-shadow-sm" />
        <span className="text-[10px] font-bold font-heading tracking-widest uppercase">Habits</span>
      </button>

      {/* Floating Action Button (FAB) for adding new quests */}
      <div className="flex-1 flex justify-center relative md:-top-4">
         <button 
           onClick={onAddQuest}
           className={`absolute -top-12 md:-top-8 w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-b-[6px] shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 active:translate-y-1 active:border-b-[3px] z-30 ${isDarkMode ? 'bg-gradient-to-b from-amber-300 to-amber-600 border-amber-800 shadow-[0_0_20px_rgba(251,191,36,0.4)] text-amber-950' : 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-700 shadow-amber-900/20 text-amber-950'}`}
         >
           <Swords className="w-7 h-7 md:w-9 md:h-9 drop-shadow-sm" />
         </button>
      </div>

      {/* One-Time Tasks Tab */}
      <button 
        onClick={() => setFilter('one-time')}
        className={`flex-1 flex flex-col items-center gap-1.5 transition-all duration-300 ${filter === 'one-time' ? (isDarkMode ? 'text-amber-400 -translate-y-1' : 'text-emerald-600 -translate-y-1') : (isDarkMode ? 'hover:text-slate-200' : 'hover:text-slate-800')}`}
      >
        <CheckSquare className="w-5 h-5 md:w-6 md:h-6 drop-shadow-sm" />
        <span className="text-[10px] font-bold font-heading tracking-widest uppercase">To Do's</span>
      </button>
      
      {/* Rewards Shop Tab */}
      <button 
        onClick={() => setFilter('rewards')}
        className={`flex-1 flex flex-col items-center gap-1.5 transition-all duration-300 ${filter === 'rewards' ? (isDarkMode ? 'text-amber-400 -translate-y-1' : 'text-emerald-600 -translate-y-1') : (isDarkMode ? 'hover:text-slate-200' : 'hover:text-slate-800')}`}
      >
        <Gift className="w-5 h-5 md:w-6 md:h-6 drop-shadow-sm" />
        <span className="text-[10px] font-bold font-heading tracking-widest uppercase">Rewards</span>
      </button>
    </nav>
  );
}
