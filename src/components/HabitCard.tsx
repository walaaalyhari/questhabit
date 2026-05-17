/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Core React imports
import { useState } from 'react';
import { motion } from 'motion/react';
// Icons
import { Trash2, Circle, Shield, Swords, Crown } from 'lucide-react';
// Types and utilities
import { Habit } from '../types';
import { canCompleteToday } from '../utils/dateMath';

// Define the properties expected by the HabitCard component
interface HabitCardProps {
  key?: string; // React key for list rendering
  habit: Habit; // The habit data object to display
  onComplete: (id: string) => void; // Callback when the user taps to complete the quest
  onDelete: (id: string) => void; // Callback when the user taps the delete icon
  isDarkMode?: boolean; // Determines the active styling theme
}

/**
 * HabitCard represents a single quest/habit in the UI.
 * It handles its own completion animation state before notifying the parent.
 */
export default function HabitCard({ habit, onComplete, onDelete, isDarkMode = false }: HabitCardProps) {
  // Determine if this habit has already been completed today to style it as 'done'
  const isCompleted = !canCompleteToday(habit.lastCompletedDate);
  
  // Local state to manage the brief "pop" animation when clicked before it grays out
  const [isJustCompleted, setIsJustCompleted] = useState(false);

  // Configuration object linking difficulty to gamified colors and icons
  const difficultyConfig = {
    common: { border: 'border-amber-400/50', borderSolid: 'border-amber-400', bgGlow: 'bg-amber-400/10', text: isDarkMode ? 'text-amber-400' : 'text-amber-600', label: 'Common', icon: Circle },
    rare: { border: 'border-emerald-400/50', borderSolid: 'border-emerald-400', bgGlow: 'bg-emerald-400/10', text: isDarkMode ? 'text-emerald-400' : 'text-emerald-600', label: 'Rare', icon: Shield },
    epic: { border: 'border-red-400/50', borderSolid: 'border-red-400', bgGlow: 'bg-red-400/10', text: isDarkMode ? 'text-red-400' : 'text-red-600', label: 'Epic', icon: Swords },
    legendary: { border: 'border-cyan-400/50', borderSolid: 'border-cyan-400', bgGlow: 'bg-cyan-400/10', text: isDarkMode ? 'text-cyan-400' : 'text-cyan-600', label: 'Legendary', icon: Crown }
  };

  const diffConfig = difficultyConfig[habit.difficulty];
  const DiffIcon = diffConfig.icon;

  // Base styling for the card, adjusting for dark/light mode
  const baseCardClass = isDarkMode 
    ? `bg-slate-900 border-2 border-b-4 hover:${diffConfig.borderSolid} shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)]` 
    : `bg-white border-2 border-b-4 hover:${diffConfig.borderSolid} shadow-sm`;

  return (
    // motion.div enables smooth layout animations when elements are added/removed
    <motion.div
      layout // Animates layout changes automatically
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        // Trigger a slight pop and shake when marked as complete
        scale: isJustCompleted ? [1, 1.05, 1] : 1,
        rotate: isJustCompleted ? [0, -2, 2, 0] : 0 
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative min-h-[76px] rounded-xl flex overflow-hidden transition-all duration-300 group cursor-pointer active:translate-y-1 active:border-b-2 ${diffConfig.border} ${baseCardClass} ${isCompleted ? 'grayscale opacity-75 active:translate-y-0' : ''} ${isJustCompleted ? `ring-4 ${diffConfig.borderSolid} shadow-lg shadow-${diffConfig.borderSolid.replace('border-', '')}/50` : ''}`}
      onClick={() => {
        // Prevent clicking again if already animating or already completed
        if (!isCompleted && !isJustCompleted) {
          setIsJustCompleted(true);
          // Wait for the animation to finish before calling the actual complete function
          setTimeout(() => {
            onComplete(habit.id);
            setIsJustCompleted(false);
          }, 400);
        }
      }}
    >
      {/* Gamified side accent bar indicating rarity */}
      <div className={`w-2 shrink-0 ${diffConfig.bgGlow} border-r ${diffConfig.border}`} />

      {/* Main card content area */}
      <div className="flex-1 flex items-center justify-between p-4 pr-5 relative">
         {/* Subtle background glow based on rarity */}
         <div className={`absolute inset-0 opacity-20 pointer-events-none ${diffConfig.bgGlow}`} />
         
         {/* Left Side: Habit Info */}
         <div className="flex flex-col relative z-10">
           {/* Habit Name and Rarity Badge */}
           <div className="flex items-center gap-2 mb-1">
             <h4 className={`text-[15px] font-bold leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'} ${isCompleted ? 'line-through opacity-50' : ''}`}>
               {habit.name}
             </h4>
             <span className={`text-[9px] flex items-center gap-1 uppercase font-black tracking-widest px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'} ${diffConfig.border} ${diffConfig.text} ${isCompleted ? 'opacity-50' : ''}`}>
               <DiffIcon className="w-3 h-3 stroke-[2.5]" />
               {diffConfig.label}
             </span>
           </div>
           
           {/* Sub-info: Icon, Type, and Reminder Time */}
           {(habit.icon || habit.reminderTime) && (
             <div className={`text-[11px] font-medium uppercase tracking-wider flex gap-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${isCompleted ? 'opacity-50' : ''}`}>
               {habit.icon && <span className="flex items-center gap-1">{habit.icon} {habit.type}</span>}
               {habit.reminderTime && <span className="flex items-center gap-1">⏰ {habit.reminderTime}</span>}
             </div>
           )}
         </div>
         
         {/* Right Side: Streak and Actions */}
         <div className="flex items-center gap-3 relative z-10">
           {/* Current Streak Indicator (Only visible if > 0) */}
           {habit.streak > 0 && (
             <div className="flex items-center gap-1 font-black text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
               <span className="text-orange-500">🔥</span>
               {habit.streak}
             </div>
           )}
           
           {/* Delete Button (Appears on hover) */}
           <button
             onClick={(e) => {
               e.stopPropagation(); // Prevent triggering the card click (completion)
               onDelete(habit.id);
             }}
             className={`transition-colors opacity-0 group-hover:opacity-100 p-1.5 rounded-md ${isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
           >
             <Trash2 className="w-4 h-4" />
           </button>
         </div>
      </div>
    </motion.div>
  );
}
