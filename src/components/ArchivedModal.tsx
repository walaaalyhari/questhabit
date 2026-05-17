// External dependencies for UI components and animations
import { X } from 'lucide-react';
import { motion } from 'motion/react';
// Internal type definitions
import { Habit } from '../types';

// Define the properties expected by the ArchivedModal component
interface ArchivedModalProps {
  isArchiveOpen: boolean; // Controls the visibility of the modal
  setIsArchiveOpen: (open: boolean) => void; // State setter to toggle modal visibility
  isDarkMode: boolean; // Determines the current theme for styling
  habits: Habit[]; // The list of all habits to filter the archived ones from
}

/**
 * ArchivedModal displays a list of quests that have been completed (if one-time)
 * or manually archived by the user.
 */
export default function ArchivedModal({ isArchiveOpen, setIsArchiveOpen, isDarkMode, habits }: ArchivedModalProps) {
  // Return early if the modal is not supposed to be open to save rendering resources
  if (!isArchiveOpen) return null;

  return (
    <>
      {/* Background Overlay: Provides a dimming effect and closes the modal when clicked */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsArchiveOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
      />
      
      {/* Modal Container: Slides in from the left, containing the archived items */}
      <motion.div
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 bottom-0 w-[85%] max-w-sm p-6 z-[120] shadow-2xl overflow-y-auto ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}
      >
        {/* Modal Header: Displays the title and the close button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Archived Quests</h2>
          <button onClick={() => setIsArchiveOpen(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-700'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List: Displays the filtered list of archived habits */}
        <div className="flex flex-col gap-2">
          {habits.filter(h => h.isArchived).length > 0 ? (
            // Map through the archived habits and render a card for each
            habits.filter(h => h.isArchived).map(habit => (
              <div key={habit.id} className={`p-3 rounded-xl flex items-center justify-between border ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                
                {/* Habit Info: Displays the icon, name (with strikethrough), and type */}
                <div className="flex items-center gap-3">
                  <span className="text-xl opacity-50 grayscale">{habit.icon}</span>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium line-through ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{habit.name}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{habit.type}</span>
                  </div>
                </div>
                
                {/* Difficulty Badge: Displays the initial of the difficulty level */}
                <div className={`text-[10px] font-bold px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'}`}>
                  Lvl {habit.difficulty.charAt(0).toUpperCase()}
                </div>
              </div>
            ))
          ) : (
            // Empty State: Displayed when there are no archived habits
            <div className={`text-xs text-center py-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>No archived quests.</div>
          )}
        </div>
      </motion.div>
    </>
  );
}
