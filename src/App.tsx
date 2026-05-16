/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HabitCard from './components/HabitCard';
import AddHabitModal from './components/AddHabitModal';
import WelcomeScreen from './components/WelcomeScreen';
import DashboardHeader from './components/DashboardHeader';
import BottomNav from './components/BottomNav';
import RewardsView from './components/RewardsView';
import SettingsModal from './components/SettingsModal';
import ArchivedModal from './components/ArchivedModal';
import { useHabits } from './hooks/useHabits';
import ghostIcon from './SVG/ghost.svg';
import darkSky from './SVG/Dark-Sky.svg';
import lightSky from './SVG/Light-Sky.svg';
import { Habit, QuestType } from './types';
import { canCompleteToday } from './utils/dateMath';

export default function App() {
  const { habits, stats, spendCoins, spendDiamonds, addHabit, completeHabit, deleteHabit, resetData } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [filter, setFilter] = useState<QuestType | 'all' | 'archived' | 'rewards'>('all');

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('Player');
  const [userAvatar, setUserAvatar] = useState('🧙‍♀️');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedStatus = localStorage.getItem('isSignedIn');
    if (storedStatus === 'true') setIsSignedIn(true);

    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);

    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) setUserAvatar(storedAvatar);

    const storedDark = localStorage.getItem('isDarkMode');
    if (storedDark === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSignIn = () => {
    setIsSignedIn(true);
    localStorage.setItem('isSignedIn', 'true');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newDark = !prev;
      localStorage.setItem('isDarkMode', String(newDark));
      if (newDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newDark;
    });
  };

  const saveProfile = (name: string, avatar: string) => {
    setUserName(name);
    setUserAvatar(avatar);
    localStorage.setItem('userName', name);
    localStorage.setItem('userAvatar', avatar);
  };

  // Filter habits
  const visibleHabits = habits.filter(h => {
    if (filter === 'archived') {
      return h.isArchived;
    }

    if (h.isArchived) return false;

    if (filter === 'all') {
      if (h.type === 'scheduled' && h.scheduledDays) {
        const today = new Date().getDay();
        return h.scheduledDays.includes(today);
      }
      return true;
    }

    if (filter === 'scheduled' || filter === 'rewards') {
      if (filter === 'rewards') return false;
      return h.type === 'scheduled';
    }

    return h.type === filter;
  });

  const incompleteHabits = visibleHabits.filter(h => canCompleteToday(h.lastCompletedDate));
  const completedHabits = visibleHabits.filter(h => !canCompleteToday(h.lastCompletedDate));

  // Check for reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      habits.forEach(habit => {
        if (habit.reminderTime === currentTime) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Quest Alert: ${habit.name}`, { body: "Time to level up your streak!" });
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [habits]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (!isSignedIn) {
    return <WelcomeScreen isDarkMode={isDarkMode} onSignIn={handleSignIn} />;
  }

  return (
    <div className={`min-h-[100dvh] flex items-center justify-center font-sans overflow-hidden sm:p-8 relative ${isDarkMode ? 'dark text-slate-100' : 'text-slate-800'}`}>
      {/* Aesthetic Background for desktop */}
      <div className="absolute inset-0 pixel-grid opacity-30 pointer-events-none z-10 mix-blend-overlay"></div>

      {/* SVG Backgrounds */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {isDarkMode ? (
          <img src={darkSky} alt="Dark Sky" className="w-full h-full object-cover" />
        ) : (
          <img src={lightSky} alt="Light Sky" className="w-full h-full object-cover" />
        )}
      </div>

      <div className={`w-full h-[100dvh] md:h-[850px] md:max-h-[90vh] md:max-w-md lg:max-w-4xl md:rounded-[2rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] relative flex flex-col overflow-hidden md:border z-20 ${isDarkMode ? 'bg-slate-950/90 backdrop-blur-md border-slate-800 shadow-[0_20px_50px_rgba(0,_0,_0,_0.5)]' : 'bg-slate-50/90 backdrop-blur-md border-white ring-1 ring-slate-200'}`}>

        <DashboardHeader
          isDarkMode={isDarkMode}
          userName={userName}
          userAvatar={userAvatar}
          stats={stats}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className={`flex-1 overflow-y-auto px-4 py-4 md:py-8 pb-24 md:pb-8 custom-scrollbar ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
          {filter === 'rewards' ? (
            <RewardsView
              isDarkMode={isDarkMode}
              stats={stats}
              spendCoins={spendCoins}
              spendDiamonds={spendDiamonds}
            />
          ) : (
            <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto">
              <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                <AnimatePresence mode="popLayout">
                  {incompleteHabits.length > 0 ? (
                    incompleteHabits.map((habit: Habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        onComplete={completeHabit}
                        onDelete={deleteHabit}
                        isDarkMode={isDarkMode}
                      />
                    ))
                  ) : (
                    completedHabits.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`col-span-full py-16 flex flex-col items-center justify-center text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
                      >
                        <div className="w-20 h-20 mb-4 opacity-50">
                          <img src={ghostIcon} alt="Empty" className="w-full h-full object-contain" />
                        </div>
                        <p className="font-bold text-base font-heading">No quests here.</p>
                        <p className="text-xs mt-1 font-semibold">Tap + to start a new adventure!</p>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>

              {completedHabits.length > 0 && (
                <div className="pt-2">
                  <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 px-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Finished Quests</h3>
                  <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 relative opacity-60 hover:opacity-100 transition-opacity">
                    <AnimatePresence mode="popLayout">
                      {completedHabits.map((habit: Habit) => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onComplete={completeHabit}
                          onDelete={deleteHabit}
                          isDarkMode={isDarkMode}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        <BottomNav
          isDarkMode={isDarkMode}
          filter={filter}
          setFilter={setFilter}
          onAddQuest={() => setIsModalOpen(true)}
        />

        <AddHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addHabit}
        />

        <SettingsModal
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          userName={userName}
          userAvatar={userAvatar}
          saveProfile={saveProfile}
          setIsArchiveOpen={setIsArchiveOpen}
          resetData={resetData}
          setIsSignedIn={setIsSignedIn}
        />

        <ArchivedModal
          isArchiveOpen={isArchiveOpen}
          setIsArchiveOpen={setIsArchiveOpen}
          isDarkMode={isDarkMode}
          habits={habits}
        />

      </div>
    </div>
  );
}
