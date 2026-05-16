/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Habit, UserStats, QuestType, QuestDifficulty, StatCategory } from '../types';
import { loadHabits, saveHabits } from '../utils/storage';
import { isToday, isYesterday, canCompleteToday } from '../utils/dateMath';

const DIFFICULTY_XP: Record<QuestDifficulty, number> = {
  common: 50,
  rare: 100,
  epic: 250,
  legendary: 500
};

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [spentCoins, setSpentCoins] = useState(0);
  const [spentDiamonds, setSpentDiamonds] = useState(0);
  
  // Persistent RPG State
  const [health, setHealth] = useState(100);
  const [hydration, setHydration] = useState(100);
  const [xpPenalty, setXpPenalty] = useState(0);
  const [diamondsPenalty, setDiamondsPenalty] = useState(0);

  const [stats, setStats] = useState<UserStats>({
    level: 1, xp: 0, xpToNextLevel: 100, totalXP: 0, health: 100, maxHealth: 100, hydration: 100, maxHydration: 100, coins: 0, diamonds: 0
  });

  const getNumberItem = (key: string, defaultVal: number = 0) => parseInt(localStorage.getItem(key) || defaultVal.toString(), 10);

  const spendCoins = (amount: number) => {
    const newSpent = spentCoins + amount;
    setSpentCoins(newSpent);
    localStorage.setItem('spentCoins', newSpent.toString());
    updateStats(habits, newSpent, spentDiamonds, xpPenalty, diamondsPenalty, health, hydration);
  };

  const spendDiamonds = (amount: number) => {
    const newSpent = spentDiamonds + amount;
    setSpentDiamonds(newSpent);
    localStorage.setItem('spentDiamonds', newSpent.toString());
    updateStats(habits, spentCoins, newSpent, xpPenalty, diamondsPenalty, health, hydration);
  };

  // Centralized stat calculation
  const updateStats = (
    currentHabits: Habit[], 
    currSpentCoins: number, 
    currSpentDiamonds: number, 
    currXpPenalty: number, 
    currDiamondsPenalty: number,
    currHealth: number,
    currHydration: number
  ) => {
    let totalXP = 0;
    let totalDiamondsEarned = 0;

    currentHabits.forEach(h => {
      const baseXP = h.totalCompletions * DIFFICULTY_XP[h.difficulty];
      const streakBonus = h.streak > 1 ? (h.streak * 5) : 0;
      totalXP += (baseXP + streakBonus);
      totalDiamondsEarned += (h.diamondsEarned || 0);
    });

    const effectiveTotalXP = Math.max(0, totalXP - currXpPenalty);
    const level = Math.floor(Math.sqrt(effectiveTotalXP / 100)) + 1;
    const currentLevelXP = Math.pow(level - 1, 2) * 100;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const xpInThisLevel = effectiveTotalXP - currentLevelXP;
    const xpRequiredForThisLevel = nextLevelXP - currentLevelXP;

    setStats({
      level,
      xp: xpInThisLevel,
      xpToNextLevel: xpRequiredForThisLevel,
      totalXP: effectiveTotalXP,
      health: currHealth,
      maxHealth: 100,
      hydration: currHydration,
      maxHydration: 100,
      coins: totalXP - currSpentCoins, // Coins are based on RAW totalXP, so death doesn't steal coins directly
      diamonds: totalDiamondsEarned - currSpentDiamonds - currDiamondsPenalty
    });
  };

  // Check deaths logic
  const checkDeaths = (
    currentHealth: number, 
    currentHydration: number, 
    currentXpPenalty: number, 
    currentDiamondsPenalty: number, 
    rawTotalXP: number
  ) => {
    let newHealth = currentHealth;
    let newHydration = currentHydration;
    let newXpPenalty = currentXpPenalty;
    let newDiamondsPenalty = currentDiamondsPenalty;
    let needsSave = false;

    const processDeath = () => {
      // Lose 1 diamond
      newDiamondsPenalty += 1;
      // Lose 1 level's worth of XP
      const effectiveTotalXP = Math.max(0, rawTotalXP - newXpPenalty);
      const level = Math.floor(Math.sqrt(effectiveTotalXP / 100)) + 1;
      const xpOfPreviousLevel = Math.pow(Math.max(1, level - 1) - 1, 2) * 100;
      const xpToLose = effectiveTotalXP - xpOfPreviousLevel;
      newXpPenalty += xpToLose;
      needsSave = true;
    };

    while (newHealth <= 0) {
      processDeath();
      newHealth += 100;
    }

    while (newHydration <= 0) {
      processDeath();
      newHydration += 100;
    }

    return { newHealth, newHydration, newXpPenalty, newDiamondsPenalty, needsSave };
  };

  // Initial load
  useEffect(() => {
    const saved = loadHabits();
    const storedSpentCoins = getNumberItem('spentCoins', 0);
    const storedSpentDiamonds = getNumberItem('spentDiamonds', 0);
    let storedHealth = getNumberItem('health', 100);
    let storedHydration = getNumberItem('hydration', 100);
    let storedXpPenalty = getNumberItem('xpPenalty', 0);
    let storedDiamondsPenalty = getNumberItem('diamondsPenalty', 0);

    setSpentCoins(storedSpentCoins);
    setSpentDiamonds(storedSpentDiamonds);
    
    let habitsChanged = false;

    // Check for missed streaks on load for daily habits
    const updatedHabits = saved.map(habit => {
      if (habit.type === 'daily' && habit.lastCompletedDate && !isToday(habit.lastCompletedDate) && !isYesterday(habit.lastCompletedDate)) {
        if (habit.streak > 0) {
          // Streak broke! Apply damage
          if (habit.statCategory === 'health') storedHealth -= 20;
          if (habit.statCategory === 'hydration') storedHydration -= 20;
          habitsChanged = true;
        }
        return { ...habit, streak: 0 };
      }
      return habit;
    });

    // Calculate raw XP to process deaths
    let rawTotalXP = 0;
    updatedHabits.forEach(h => {
      const baseXP = h.totalCompletions * DIFFICULTY_XP[h.difficulty];
      const streakBonus = h.streak > 1 ? (h.streak * 5) : 0;
      rawTotalXP += (baseXP + streakBonus);
    });

    const deathResult = checkDeaths(storedHealth, storedHydration, storedXpPenalty, storedDiamondsPenalty, rawTotalXP);

    if (deathResult.needsSave || habitsChanged) {
      localStorage.setItem('health', deathResult.newHealth.toString());
      localStorage.setItem('hydration', deathResult.newHydration.toString());
      localStorage.setItem('xpPenalty', deathResult.newXpPenalty.toString());
      localStorage.setItem('diamondsPenalty', deathResult.newDiamondsPenalty.toString());
      
      if (habitsChanged) saveHabits(updatedHabits);
    }

    setHealth(deathResult.newHealth);
    setHydration(deathResult.newHydration);
    setXpPenalty(deathResult.newXpPenalty);
    setDiamondsPenalty(deathResult.newDiamondsPenalty);
    setHabits(updatedHabits);

    updateStats(updatedHabits, storedSpentCoins, storedSpentDiamonds, deathResult.newXpPenalty, deathResult.newDiamondsPenalty, deathResult.newHealth, deathResult.newHydration);
  }, []);

  const addHabit = (
    name: string, 
    reminderTime: string, 
    icon: string, 
    type: QuestType = 'daily', 
    difficulty: QuestDifficulty = 'common', 
    scheduledDays: number[] = [],
    statCategory?: StatCategory
  ) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      type,
      difficulty,
      statCategory,
      streak: 0,
      totalCompletions: 0,
      lastCompletedDate: null,
      scheduledDays: type === 'scheduled' ? scheduledDays : undefined,
      reminderTime,
      icon,
      createdAt: new Date().toISOString(),
      isArchived: false,
      diamondsEarned: 0
    };
    const newHabits = [...habits, newHabit];
    setHabits(newHabits);
    saveHabits(newHabits);
    updateStats(newHabits, spentCoins, spentDiamonds, xpPenalty, diamondsPenalty, health, hydration);
  };

  /**
   * Marks a habit as complete for today. Updates streak multipliers 
   * and handles healing/diamonds.
   */
  const completeHabit = (id: string) => {
    let newHealth = health;
    let newHydration = hydration;
    let habitsChanged = false;

    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        if (!canCompleteToday(habit.lastCompletedDate)) return habit;
        habitsChanged = true;

        let newStreak = 1;
        let earnedDiam = habit.diamondsEarned || 0;

        if (habit.lastCompletedDate && isYesterday(habit.lastCompletedDate)) {
          newStreak = habit.streak + 1;
          earnedDiam += 1; // Earn diamond for maintaining streak

          // Heal 10 for maintaining streak
          if (habit.statCategory === 'health') newHealth = Math.min(100, newHealth + 10);
          if (habit.statCategory === 'hydration') newHydration = Math.min(100, newHydration + 10);
        } else if (!habit.lastCompletedDate || !isYesterday(habit.lastCompletedDate)) {
          // Heal 5 for starting a new streak
          if (habit.statCategory === 'health') newHealth = Math.min(100, newHealth + 5);
          if (habit.statCategory === 'hydration') newHydration = Math.min(100, newHydration + 5);
        }

        const isOneTime = habit.type === 'one-time';

        return {
          ...habit,
          streak: newStreak,
          diamondsEarned: earnedDiam,
          totalCompletions: habit.totalCompletions + 1,
          lastCompletedDate: new Date().toISOString(),
          isArchived: habit.isArchived || isOneTime
        };
      }
      return habit;
    });

    if (habitsChanged) {
      if (newHealth !== health) {
        setHealth(newHealth);
        localStorage.setItem('health', newHealth.toString());
      }
      if (newHydration !== hydration) {
        setHydration(newHydration);
        localStorage.setItem('hydration', newHydration.toString());
      }

      setHabits(updatedHabits);
      saveHabits(updatedHabits);
      updateStats(updatedHabits, spentCoins, spentDiamonds, xpPenalty, diamondsPenalty, newHealth, newHydration);
    }
  };

  const deleteHabit = (id: string) => {
    const target = habits.find(h => h.id === id);
    if (!target) return;
    
    let newHabits;
    if (target.isArchived) {
      newHabits = habits.filter(h => h.id !== id);
    } else {
      newHabits = habits.map(h => h.id === id ? { ...h, isArchived: true } : h);
    }
    
    setHabits(newHabits);
    saveHabits(newHabits);
    updateStats(newHabits, spentCoins, spentDiamonds, xpPenalty, diamondsPenalty, health, hydration);
  };

  const resetData = () => {
    localStorage.removeItem('quest_habit_tracker_data');
    localStorage.removeItem('spentCoins');
    localStorage.removeItem('spentDiamonds');
    localStorage.removeItem('health');
    localStorage.removeItem('hydration');
    localStorage.removeItem('xpPenalty');
    localStorage.removeItem('diamondsPenalty');

    setHabits([]);
    setSpentCoins(0);
    setSpentDiamonds(0);
    setHealth(100);
    setHydration(100);
    setXpPenalty(0);
    setDiamondsPenalty(0);

    setStats({
      level: 1, xp: 0, xpToNextLevel: 100, totalXP: 0, health: 100, maxHealth: 100, hydration: 100, maxHydration: 100, coins: 0, diamonds: 0
    });
  };

  return {
    habits,
    stats,
    spendCoins,
    spendDiamonds,
    addHabit,
    completeHabit,
    deleteHabit,
    resetData
  };
};
