/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuestType = 'daily' | 'scheduled' | 'one-time';
export type QuestDifficulty = 'common' | 'rare' | 'epic' | 'legendary';
export type StatCategory = 'health' | 'improvement' | 'hydration';

export interface Habit {
  id: string;
  name: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  statCategory?: StatCategory;
  streak: number;
  totalCompletions: number;
  lastCompletedDate: string | null; // ISO Date String
  scheduledDays?: number[]; // 0-6 for Sun-Sat
  reminderTime: string; // HH:mm format
  icon: string;
  createdAt: string;
  isArchived?: boolean;
  diamondsEarned?: number;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: string;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  health: number;
  maxHealth: number;
  hydration: number;
  maxHydration: number;
  coins: number;
  diamonds: number;
}
