/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks if a given ISO date string occurred today (local time).
 * Used to determine if a quest has already been completed today.
 * @param dateStr ISO date string
 * @returns boolean true if today
 */
export const isToday = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Checks if a given ISO date string occurred yesterday (local time).
 * Used for maintaining consecutive day streaks.
 * @param dateStr ISO date string
 * @returns boolean true if yesterday
 */
export const isYesterday = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Determines if a habit is eligible to be completed today.
 * Returns true if it has never been completed, or if the last completion was not today.
 * @param lastCompletedDate ISO date string or null
 * @returns boolean true if the habit can be completed today
 */
export const canCompleteToday = (lastCompletedDate: string | null): boolean => {
  // If it has never been completed, it can definitely be completed today
  if (!lastCompletedDate) return true;
  // Otherwise, it can only be completed if the last completion wasn't today
  return !isToday(lastCompletedDate);
};
