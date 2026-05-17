import { X, Archive, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

// Define the properties expected by the SettingsModal component
interface SettingsModalProps {
  isSettingsOpen: boolean; // Controls modal visibility
  setIsSettingsOpen: (open: boolean) => void; // Callback to close/open the modal
  isDarkMode: boolean; // Current theme state
  toggleDarkMode: () => void; // Callback to switch themes
  userName: string; // Current user's display name
  userAvatar: string; // Current user's chosen emoji avatar
  saveProfile: (name: string, avatar: string) => void; // Callback to save profile edits
  setIsArchiveOpen: (open: boolean) => void; // Callback to open the archived quests view
  resetData: () => void; // Callback to wipe all player progress and data
  setIsSignedIn: (signedIn: boolean) => void; // Callback to log the user out to the welcome screen
}

/**
 * SettingsModal provides the configuration interface for the user,
 * allowing profile edits, dark mode toggles, and data management.
 */
export default function SettingsModal({
  isSettingsOpen, setIsSettingsOpen, isDarkMode, toggleDarkMode,
  userName, userAvatar, saveProfile, setIsArchiveOpen, resetData, setIsSignedIn
}: SettingsModalProps) {
  // Do not render if the modal is not open
  if (!isSettingsOpen) return null;

  return (
    <>
      {/* Background Overlay: Dimming the dashboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSettingsOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] pointer-events-auto"
      />
      
      {/* Settings Panel: Slides in from the left */}
      <motion.div
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 bottom-0 w-[85%] max-w-sm p-6 z-[100] shadow-2xl overflow-y-auto ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Settings</h2>
          <button onClick={() => setIsSettingsOpen(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-700'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8 pb-12">
          {/* Section: Profile Edit */}
          <div>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Edit Profile</h3>
            <div className="flex flex-col gap-3">
              {/* Avatar Input */}
              <div>
                <label className={`block text-xs mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Avatar (Emoji)</label>
                <input 
                  type="text" 
                  maxLength={2} // Restrict to roughly one emoji character
                  value={userAvatar}
                  onChange={(e) => saveProfile(userName, e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
              {/* Display Name Input */}
              <div>
                <label className={`block text-xs mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Display Name</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => saveProfile(e.target.value, userAvatar)}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
            </div>
          </div>

          {/* Section: Preferences */}
          <div className={`pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Preferences</h3>
            
            {/* Dark Mode Toggle Switch */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Dark Mode</span>
              <button 
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-emerald-600' : 'bg-slate-300'}`}
              >
                <motion.div 
                   className={`w-4 h-4 bg-white rounded-full shadow-sm`}
                   animate={{ x: isDarkMode ? 24 : 0 }}
                />
              </button>
            </div>
          </div>

          {/* Section: Data Management */}
          <div className={`pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Data</h3>
            <div className="flex flex-col gap-2">
              {/* Open Archive Modal Button */}
              <button
                onClick={() => setIsArchiveOpen(true)}
                className={`w-full text-left p-3 rounded-lg border transition-colors text-sm font-bold flex items-center justify-between ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'}`}
              >
                Archived Quests
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section: Danger Zone */}
          <div className={`pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-4 text-red-500`}>Danger Zone</h3>
            <div className="flex flex-col gap-2">
              {/* Hard Reset Button */}
              <button
                onClick={() => {
                  // Require confirmation before wiping data
                  if (window.confirm("Are you sure you want to erase all data and start over? This cannot be undone.")) {
                    resetData();
                    localStorage.clear();
                    setIsSignedIn(false);
                    saveProfile('Player', '🧙‍♀️');
                    setIsSettingsOpen(false);
                  }
                }}
                className="w-full text-left p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors text-sm font-bold flex items-center justify-between"
              >
                Reset All Data
                <Archive className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* App Metadata */}
          <div className={`pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-500'}`}>App Info</h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Version 1.0.0</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
