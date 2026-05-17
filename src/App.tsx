/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Core React hooks for component state and side effects
import { useState, useEffect } from 'react';
// Animation library for smooth UI transitions
import { motion, AnimatePresence } from 'motion/react';

// Main UI Components
import HabitCard from './components/HabitCard';
import AddHabitModal from './components/AddHabitModal';
import WelcomeScreen from './components/WelcomeScreen';
import DashboardHeader from './components/DashboardHeader';
import BottomNav from './components/BottomNav';
import RewardsView from './components/RewardsView';
import SettingsModal from './components/SettingsModal';
import ArchivedModal from './components/ArchivedModal';

// Custom hooks for global state management
import { useHabits } from './hooks/useHabits';

// Static assets for empty states and backgrounds
import ghostIcon from './SVG/ghost.svg';
import darkSky from './SVG/Dark-Sky.svg';
import lightSky from './SVG/Light-Sky.svg';

// Types and utilities
import { Habit, QuestType } from './types';
import { canCompleteToday } from './utils/dateMath';

export default function App() {
  // Destructure habit management functions and global stats from custom hook
  const { habits, stats, spendCoins, spendDiamonds, addHabit, completeHabit, deleteHabit, resetData } = useHabits();
  
  // UI State: Controls the visibility of various modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  
  // Filter State: Determines which quests or views are currently displayed
  const [filter, setFilter] = useState<QuestType | 'all' | 'archived' | 'rewards'>('all');

  // User Profile State: Manages authentication and customization
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('Player');
  const [userAvatar, setUserAvatar] = useState('🧙‍♀️');
  
  // Theme State: Controls light/dark mode styling
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize app state from local storage on first mount
  useEffect(() => {
    // Check if the user has signed in previously
    const storedStatus = localStorage.getItem('isSignedIn');
    if (storedStatus === 'true') setIsSignedIn(true);

    // Restore user profile settings
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);

    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) setUserAvatar(storedAvatar);

    // Apply dark mode if it was previously enabled
    const storedDark = localStorage.getItem('isDarkMode');
    if (storedDark === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Event Handler: Updates auth state and persists to storage
  const handleSignIn = () => {
    setIsSignedIn(true);
    localStorage.setItem('isSignedIn', 'true');
  };

  // Event Handler: Toggles theme and updates the DOM root class for Tailwind
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

  // Event Handler: Updates user profile data and persists it
  const saveProfile = (name: string, avatar: string) => {
    setUserName(name);
    setUserAvatar(avatar);
    localStorage.setItem('userName', name);
    localStorage.setItem('userAvatar', avatar);
  };

  // Filter Logic: Determines which habits to show based on the active tab
  const visibleHabits = habits.filter(h => {
    // Show only archived habits
    if (filter === 'archived') {
      return h.isArchived;
    }

    // Hide archived habits from all other views
    if (h.isArchived) return false;

    // Show habits relevant to today when viewing 'all'
    if (filter === 'all') {
      if (h.type === 'scheduled' && h.scheduledDays) {
        const today = new Date().getDay();
        return h.scheduledDays.includes(today);
      }
      return true; // Show daily and one-time quests unconditionally
    }

    // Handle specific filters (scheduled view vs rewards view)
    if (filter === 'scheduled' || filter === 'rewards') {
      if (filter === 'rewards') return false; // Rewards view doesn't show quests
      return h.type === 'scheduled';
    }

    // Filter by specific QuestType
    return h.type === filter;
  });

  // Separate habits into completed and incomplete lists for UI ordering
  const incompleteHabits = visibleHabits.filter(h => canCompleteToday(h.lastCompletedDate));
  const completedHabits = visibleHabits.filter(h => !canCompleteToday(h.lastCompletedDate));

  // Notification Effect: Polls every minute to check if a habit reminder should be triggered
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Format current time as HH:mm to match reminderTime format
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Check all habits for matching reminder times
      habits.forEach(habit => {
        if (habit.reminderTime === currentTime) {
          // Trigger a system notification if permissions are granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Quest Alert: ${habit.name}`, { body: "Time to level up your streak!" });
          }
        }
      });
    }, 60000); // Run every 60 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [habits]);

  // Request notification permissions when the app first loads
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Display the welcome screen if the user hasn't signed in yet
  if (!isSignedIn) {
    return <WelcomeScreen isDarkMode={isDarkMode} onSignIn={handleSignIn} />;
  }

  return (
    <div className={`min-h-[100dvh] flex items-center justify-center font-sans overflow-hidden sm:p-8 relative ${isDarkMode ? 'dark text-slate-100' : 'text-slate-800'}`}>
      {/* Aesthetic pixel grid overlay for retro game feel */}
      <div className="absolute inset-0 pixel-grid opacity-30 pointer-events-none z-10 mix-blend-overlay"></div>

      {/* Responsive background image (hidden on mobile for cleaner UI) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {isDarkMode ? (
          <img src={darkSky} alt="Dark Sky" className="w-full h-full object-cover" />
        ) : (
          <img src={lightSky} alt="Light Sky" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Main App Container: Simulates a mobile screen on desktop */}
      <div className={`w-full h-[100dvh] md:h-[850px] md:max-h-[90vh] md:max-w-md lg:max-w-4xl md:rounded-[2rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] relative flex flex-col overflow-hidden md:border z-20 ${isDarkMode ? 'bg-slate-950/90 backdrop-blur-md border-slate-800 shadow-[0_20px_50px_rgba(0,_0,_0,_0.5)]' : 'bg-slate-50/90 backdrop-blur-md border-white ring-1 ring-slate-200'}`}>

        {/* Top bar displaying player stats and settings button */}
        <DashboardHeader
          isDarkMode={isDarkMode}
          userName={userName}
          userAvatar={userAvatar}
          stats={stats}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Scrollable content area for quests or rewards */}
        <main className={`flex-1 overflow-y-auto px-4 py-4 md:py-8 pb-24 md:pb-8 custom-scrollbar ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
          {filter === 'rewards' ? (
            // Show the in-game shop if 'Rewards' tab is selected
            <RewardsView
              isDarkMode={isDarkMode}
              stats={stats}
              spendCoins={spendCoins}
              spendDiamonds={spendDiamonds}
            />
          ) : (
            // Show the quest list for all other tabs
            <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto">
              
              {/* Active / Incomplete Quests Grid */}
              <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                <AnimatePresence mode="popLayout">
                  {incompleteHabits.length > 0 ? (
                    // Render interactive habit cards
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
                    // Show empty state if there are no quests to complete
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

              {/* Completed Quests Section (rendered below active quests) */}
              {completedHabits.length > 0 && (
                <div className="pt-2">
                  <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 px-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Finished Quests</h3>
                  {/* Dimmed container for completed items */}
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

        {/* Bottom navigation bar for switching views and adding quests */}
        <BottomNav
          isDarkMode={isDarkMode}
          filter={filter}
          setFilter={setFilter}
          onAddQuest={() => setIsModalOpen(true)}
        />

        {/* Modal overlays */}
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
