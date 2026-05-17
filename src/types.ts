/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Defines the frequency or duration of a quest (habit)
export type QuestType = 'daily' | 'scheduled' | 'one-time';

// Defines the rarity/difficulty of a quest, affecting XP and rewards
export type QuestDifficulty = 'common' | 'rare' | 'epic' | 'legendary';

// Categorizes the quest into different stats to update player attributes
export type StatCategory = 'health' | 'improvement' | 'hydration';

/**
 * Interface representing a user's Habit or Quest in the gamified tracker.
 */
export interface Habit {
  id: string; // Unique identifier for the habit
  name: string; // Display name of the habit
  type: QuestType; // The frequency type (daily, scheduled, one-time)
  difficulty: QuestDifficulty; // Reward tier difficulty
  statCategory?: StatCategory; // Which player stat this habit improves
  streak: number; // Current consecutive completion streak
  totalCompletions: number; // Total number of times this habit was completed
  lastCompletedDate: string | null; // ISO Date String indicating last completion
  scheduledDays?: number[]; // Array of days (0-6 for Sun-Sat) if type is 'scheduled'
  reminderTime: string; // HH:mm format for user notifications
  icon: string; // Emoji or identifier for the habit's icon
  createdAt: string; // ISO Date String of when the habit was created
  isArchived?: boolean; // True if the habit is soft-deleted or completed as one-time
  diamondsEarned?: number; // Total premium currency earned from this habit
}

/**
 * Interface representing a purchasable reward in the in-game shop.
 */
export interface Reward {
  id: string; // Unique identifier for the reward
  name: string; // Display name of the reward item
  cost: number; // Cost in coins required to purchase
  icon: string; // Emoji or identifier for the reward's icon
}

/**
 * Interface representing the player's overall RPG statistics and progress.
 */
export interface UserStats {
  level: number; // Current player level
  xp: number; // Current experience points towards the next level
  xpToNextLevel: number; // Total experience points required to level up
  totalXP: number; // Cumulative experience points earned
  health: number; // Current player health points
  maxHealth: number; // Maximum possible health points
  hydration: number; // Current player hydration level
  maxHydration: number; // Maximum possible hydration level
  coins: number; // Standard currency earned from completing quests
  diamonds: number; // Premium currency earned from special achievements
}
