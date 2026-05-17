import { UserStats } from '../types';

// Define the properties expected by the RewardsView component
interface RewardsViewProps {
  isDarkMode: boolean; // Determines the active styling theme
  stats: UserStats; // The player's current RPG statistics, needed to check currency balances
  spendCoins: (amount: number) => void; // Callback to deduct coins upon purchase
  spendDiamonds: (amount: number) => void; // Callback to deduct diamonds upon purchase
}

// Hardcoded list of available rewards in the shop
const REWARDS = [
  { id: 1, name: 'Unhealthy Snack', cost: 15, currency: 'coins', icon: '🍫', desc: 'A bit of indulgence' },
  { id: 2, name: 'Game Time!', cost: 45, currency: 'coins', icon: '🎮', desc: '2 to 3 hours' },
  { id: 3, name: 'Treat Yourself', cost: 100, currency: 'coins', icon: '🎁', desc: 'Something nice' },
  { id: 4, name: 'Pizza Party', cost: 500, currency: 'coins', icon: '🍕', desc: 'With friends' },
  { id: 5, name: 'New Game', cost: 10, currency: 'gems', icon: '🕹️', desc: 'Buy a game' },
  { id: 6, name: 'Spa Day', cost: 20, currency: 'gems', icon: '💆‍♀️', desc: 'Total relaxation' },
  { id: 7, name: 'Concert Ticket', cost: 50, currency: 'gems', icon: '🎫', desc: 'Live music' },
  { id: 8, name: 'Weekend Trip', cost: 100, currency: 'gems', icon: '✈️', desc: 'A short vacation' },
];

/**
 * RewardsView component displays the available rewards the user can purchase
 * using their hard-earned coins and diamonds.
 */
export default function RewardsView({ isDarkMode, stats, spendCoins, spendDiamonds }: RewardsViewProps) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      
      {/* Wallet / Currency Overview Panel */}
      <div className={`p-4 rounded-xl shadow-sm border flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h2 className={`text-sm font-bold flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            <span>Available Wealth</span>
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rewards are treats for yourself after gaining enough coins or gems from doing quests.</p>
        </div>
        
        {/* Current Balances */}
        <div className="flex flex-col gap-1 items-end shrink-0">
          <span className="text-amber-500 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md text-xs">🪙 {stats.coins}</span>
          <span className="text-cyan-400 font-bold flex items-center gap-1 bg-cyan-400/10 px-2 py-0.5 rounded-md text-xs">💎 {stats.diamonds}</span>
        </div>
      </div>
      
      {/* Rewards Shop Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {REWARDS.map(reward => {
          // Check if the user has enough of the specific currency to afford this reward
          const canAfford = reward.currency === 'coins' ? stats.coins >= reward.cost : stats.diamonds >= reward.cost;
          
          return (
            <button 
              key={reward.id}
              disabled={!canAfford} // Disable button if player can't afford it
              onClick={() => reward.currency === 'coins' ? spendCoins(reward.cost) : spendDiamonds(reward.cost)}
              className={`p-3 rounded-xl border flex flex-col justify-between h-28 hover:border-emerald-300 transition-colors cursor-pointer disabled:opacity-50 disabled:grayscale relative group text-left active:scale-[0.98] ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="text-2xl mb-1">{reward.icon}</div>
              <div>
                <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{reward.name}</div>
                <div className={`text-[10px] truncate mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{reward.desc}</div>
              </div>
              
              {/* Cost Badge */}
              <div className={`absolute top-2 right-2 font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                reward.currency === 'coins'
                  ? (isDarkMode ? 'bg-amber-900/30 text-amber-400 border-amber-900/50' : 'bg-amber-50 text-amber-600 border-amber-200')
                  : (isDarkMode ? 'bg-cyan-900/30 text-cyan-400 border-cyan-900/50' : 'bg-cyan-50 text-cyan-600 border-cyan-200')
              }`}>
                <span className="text-[8px]">{reward.currency === 'coins' ? '🪙' : '💎'}</span> {reward.cost}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
