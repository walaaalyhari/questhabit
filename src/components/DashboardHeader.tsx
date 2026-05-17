import { Menu } from 'lucide-react';
import { UserStats } from '../types';
import levelIcon from '../SVG/level.svg';
import coinIcon from '../SVG/coin.svg';
import gemIcon from '../SVG/gem.svg';

// Define the properties expected by the DashboardHeader component
interface DashboardHeaderProps {
  isDarkMode: boolean; // Determines the active styling theme
  userName: string; // The player's display name
  userAvatar: string; // The player's chosen avatar emoji
  stats: UserStats; // The player's current RPG statistics (level, hp, mp, xp, coins, etc.)
  onOpenSettings: () => void; // Callback to open the settings/profile modal
}

/**
 * DashboardHeader component displays the user's profile, health, XP, and hydration stats.
 * It sits at the top of the main dashboard and gives a quick overview of player progression.
 */
export default function DashboardHeader({ isDarkMode, userName, userAvatar, stats, onOpenSettings }: DashboardHeaderProps) {
  return (
    // Header container with sticky-like behavior on mobile and rounded corners on desktop
    <header className={`${isDarkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-slate-100'} px-5 pt-12 md:pt-6 pb-4 flex flex-col gap-4 z-10 shrink-0`}>
      
      {/* Top Bar: Settings button and Player Name */}
      <div className="flex items-center justify-between">
        <button onClick={onOpenSettings} className={`transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold truncate px-2">{userName}</h1>
        <div className="flex items-center gap-4 w-6">
          {/* Empty div to balance the flex layout (keeps the title centered) */}
        </div>
      </div>

      {/* Main Stats Area: Avatar and RPG Bars */}
      <div className="flex gap-4 items-center">
        
        {/* Avatar Display with Level Badge */}
        <div className="relative">
          {/* Glowing background effect for the avatar */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full blur opacity-40"></div>
          
          <div className={`w-20 h-20 rounded-full overflow-hidden shrink-0 relative rpg-border ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
             <div className="w-full h-full flex items-center justify-center text-4xl">
               {userAvatar}
             </div>
          </div>
          
          {/* Level Badge anchored to the bottom right of the avatar */}
          <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white font-heading font-black text-xs px-2 py-0.5 rounded-md border-2 border-amber-400 shadow-md">
            Lv {stats.level}
          </div>
        </div>
        
        {/* RPG Stat Bars (XP, Health, Hydration) */}
        <div className="flex-1 space-y-3">
          
          {/* Exp (Improvement / Skill) Bar */}
          <div className="flex items-center gap-3 cursor-help" title="Gain XP by completing quests.">
            <div className="text-amber-400 text-base drop-shadow-md">✨</div>
            <div className="rpg-bar-container">
              {/* Dynamic width based on XP progress */}
              <div 
                className="rpg-bar-fill bar-xp" 
                style={{ width: `${Math.min(100, Math.max(0, (stats.xp / stats.xpToNextLevel) * 100))}%` }}
              ></div>
              {/* Overlay text showing exact XP numbers */}
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80 z-10 font-heading tracking-widest text-shadow-sm">XP {Math.floor(stats.xp)}/{stats.xpToNextLevel}</div>
            </div>
          </div>
          
          {/* Health Bar */}
          <div className="flex items-center gap-3 cursor-help" title="Lose HP by breaking daily streaks. Maintain streaks to heal. If HP reaches 0, you lose a level!">
            <div className="text-red-500 text-base drop-shadow-md">❤️</div>
            <div className="rpg-bar-container">
              <div className="rpg-bar-fill bar-health" style={{ width: `${Math.max(0, (stats.health / stats.maxHealth) * 100)}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80 z-10 font-heading tracking-widest text-shadow-sm">HP {Math.max(0, stats.health)}/{stats.maxHealth}</div>
            </div>
          </div>
          
          {/* Hydration (Mana) Bar */}
          <div className="flex items-center gap-3 cursor-help" title="Lose MP by breaking hydration streaks. Maintain streaks to heal. If MP reaches 0, you lose a level!">
            <div className="text-blue-400 text-base drop-shadow-md">💧</div>
            <div className="rpg-bar-container">
              <div className="rpg-bar-fill bar-mana" style={{ width: `${Math.max(0, (stats.hydration / stats.maxHydration) * 100)}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80 z-10 font-heading tracking-widest text-shadow-sm">MP {Math.max(0, stats.hydration)}/{stats.maxHydration}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Currency/Summary Bar */}
      <div className={`flex justify-between items-center px-1 text-xs font-bold mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
         {/* Level Summary */}
         <div className="flex items-center gap-1.5"><img src={levelIcon} alt="Level" className="w-6 h-6" /> Lvl {stats.level}</div>
         
         {/* Currency Displays */}
         <div className="flex items-center gap-4">
           {/* Coins: Earned from all quests */}
           <span className="flex items-center gap-1 cursor-help" title="Gained by doing quests"><img src={coinIcon} alt="Coins" className="w-5 h-5 drop-shadow-sm" /> {stats.coins}</span>
           {/* Diamonds: Earned from streaks */}
           <span className="flex items-center gap-1 cursor-help" title="Gained by maintaining daily habit streaks"><img src={gemIcon} alt="Diamonds" className="w-5 h-5 drop-shadow-sm" /> {stats.diamonds}</span>
         </div>
      </div>
    </header>
  );
}
