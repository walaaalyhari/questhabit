import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { Habit } from '../types';

interface ArchivedModalProps {
  isArchiveOpen: boolean;
  setIsArchiveOpen: (open: boolean) => void;
  isDarkMode: boolean;
  habits: Habit[];
}

/**
 * ArchivedModal displays a list of quests that have been completed (if one-time)
 * or manually archived by the user.
 */
export default function ArchivedModal({ isArchiveOpen, setIsArchiveOpen, isDarkMode, habits }: ArchivedModalProps) {
  if (!isArchiveOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsArchiveOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
      />
      <motion.div
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 bottom-0 w-[85%] max-w-sm p-6 z-[120] shadow-2xl overflow-y-auto ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Archived Quests</h2>
          <button onClick={() => setIsArchiveOpen(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-700'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {habits.filter(h => h.isArchived).length > 0 ? (
            habits.filter(h => h.isArchived).map(habit => (
              <div key={habit.id} className={`p-3 rounded-xl flex items-center justify-between border ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl opacity-50 grayscale">{habit.icon}</span>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium line-through ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{habit.name}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{habit.type}</span>
                  </div>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'}`}>
                  Lvl {habit.difficulty.charAt(0).toUpperCase()}
                </div>
              </div>
            ))
          ) : (
            <div className={`text-xs text-center py-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>No archived quests.</div>
          )}
        </div>
      </motion.div>
    </>
  );
}
