/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Habit } from '../types';
import { canCompleteToday } from '../utils/dateMath';
import { Trash2, Circle, Shield, Swords, Crown } from 'lucide-react';
import { motion } from 'motion/react';

interface HabitCardProps {
  key?: string;
  habit: Habit;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isDarkMode?: boolean;
}

export default function HabitCard({ habit, onComplete, onDelete, isDarkMode = false }: HabitCardProps) {
  const isCompleted = !canCompleteToday(habit.lastCompletedDate);
  const [isJustCompleted, setIsJustCompleted] = useState(false);

  // Gamified colors based on rarity
  const difficultyConfig = {
    common: { border: 'border-amber-400/50', borderSolid: 'border-amber-400', bgGlow: 'bg-amber-400/10', text: isDarkMode ? 'text-amber-400' : 'text-amber-600', label: 'Common', icon: Circle },
    rare: { border: 'border-emerald-400/50', borderSolid: 'border-emerald-400', bgGlow: 'bg-emerald-400/10', text: isDarkMode ? 'text-emerald-400' : 'text-emerald-600', label: 'Rare', icon: Shield },
    epic: { border: 'border-red-400/50', borderSolid: 'border-red-400', bgGlow: 'bg-red-400/10', text: isDarkMode ? 'text-red-400' : 'text-red-600', label: 'Epic', icon: Swords },
    legendary: { border: 'border-cyan-400/50', borderSolid: 'border-cyan-400', bgGlow: 'bg-cyan-400/10', text: isDarkMode ? 'text-cyan-400' : 'text-cyan-600', label: 'Legendary', icon: Crown }
  };

  const diffConfig = difficultyConfig[habit.difficulty];
  const DiffIcon = diffConfig.icon;

  const baseCardClass = isDarkMode 
    ? `bg-slate-900 border-2 border-b-4 hover:${diffConfig.borderSolid} shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)]` 
    : `bg-white border-2 border-b-4 hover:${diffConfig.borderSolid} shadow-sm`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: isJustCompleted ? [1, 1.05, 1] : 1,
        rotate: isJustCompleted ? [0, -2, 2, 0] : 0 
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative min-h-[76px] rounded-xl flex overflow-hidden transition-all duration-300 group cursor-pointer active:translate-y-1 active:border-b-2 ${diffConfig.border} ${baseCardClass} ${isCompleted ? 'grayscale opacity-75 active:translate-y-0' : ''} ${isJustCompleted ? `ring-4 ${diffConfig.borderSolid} shadow-lg shadow-${diffConfig.borderSolid.replace('border-', '')}/50` : ''}`}
      onClick={() => {
        if (!isCompleted && !isJustCompleted) {
          setIsJustCompleted(true);
          setTimeout(() => {
            onComplete(habit.id);
            setIsJustCompleted(false);
          }, 400);
        }
      }}
    >
      {/* Gamified side accent */}
      <div className={`w-2 shrink-0 ${diffConfig.bgGlow} border-r ${diffConfig.border}`} />

      <div className="flex-1 flex items-center justify-between p-4 pr-5 relative">
         {/* Subtle background glow */}
         <div className={`absolute inset-0 opacity-20 pointer-events-none ${diffConfig.bgGlow}`} />
         
         <div className="flex flex-col relative z-10">
           <div className="flex items-center gap-2 mb-1">
             <h4 className={`text-[15px] font-bold leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'} ${isCompleted ? 'line-through opacity-50' : ''}`}>
               {habit.name}
             </h4>
             <span className={`text-[9px] flex items-center gap-1 uppercase font-black tracking-widest px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'} ${diffConfig.border} ${diffConfig.text} ${isCompleted ? 'opacity-50' : ''}`}>
               <DiffIcon className="w-3 h-3 stroke-[2.5]" />
               {diffConfig.label}
             </span>
           </div>
           {(habit.icon || habit.reminderTime) && (
             <div className={`text-[11px] font-medium uppercase tracking-wider flex gap-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${isCompleted ? 'opacity-50' : ''}`}>
               {habit.icon && <span className="flex items-center gap-1">{habit.icon} {habit.type}</span>}
               {habit.reminderTime && <span className="flex items-center gap-1">⏰ {habit.reminderTime}</span>}
             </div>
           )}
         </div>
         
         <div className="flex items-center gap-3 relative z-10">
           {habit.streak > 0 && (
             <div className="flex items-center gap-1 font-black text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
               <span className="text-orange-500">🔥</span>
               {habit.streak}
             </div>
           )}
           
           <button
             onClick={(e) => {
               e.stopPropagation();
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
