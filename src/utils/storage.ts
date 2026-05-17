/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Habit } from '../types';

// The key used to store the serialized habit array in the browser's localStorage
const STORAGE_KEY = 'quest_habit_tracker_data';

/**
 * Serializes the current array of habits and saves it to localStorage.
 * This ensures data persists across page reloads.
 * @param habits Array of Habit objects to save
 */
export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

/**
 * Retrieves and deserializes the habit array from localStorage.
 * If no data is found, returns an empty array to initialize the app state.
 * @returns Array of saved Habit objects
 */
export const loadHabits = (): Habit[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
