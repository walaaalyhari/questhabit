import { motion } from 'motion/react';
import questIcon from '../SVG/quest.svg';

interface WelcomeScreenProps {
  isDarkMode: boolean;
  onSignIn: () => void;
}

/**
 * WelcomeScreen component displayed to users before they "sign in" or start.
 * Serves as the landing page / onboarding intro.
 */
export default function WelcomeScreen({ isDarkMode, onSignIn }: WelcomeScreenProps) {
  return (
    <div className={`min-h-[100dvh] flex items-center justify-center p-6 ${isDarkMode ? 'dark bg-slate-950 font-sans text-slate-100' : 'bg-slate-100 font-sans text-slate-800'}`}>
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className={`w-full max-w-sm p-8 rounded-3xl shadow-xl flex flex-col items-center text-center rpg-panel`}
      >
        <div className="w-24 h-24 mb-6 relative">
          <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <img src={questIcon} alt="Quest" className="w-full h-full relative z-10 drop-shadow-lg" />
        </div>
        <h1 className="text-3xl font-black mb-2 font-heading tracking-wide">QuestHabit</h1>
        <p className={`text-sm mb-8 font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Level up your life by turning your tasks into an epic RPG adventure.</p>
        <button 
          onClick={onSignIn}
          className="w-full rpg-button py-4 px-4 text-lg"
        >
          Start your Adventure
        </button>
      </motion.div>
    </div>
  );
}
