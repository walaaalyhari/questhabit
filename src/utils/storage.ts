/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Habit } from '../types';

const STORAGE_KEY = 'quest_habit_tracker_data';

export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

export const loadHabits = (): Habit[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
