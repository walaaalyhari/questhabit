/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks if a given ISO date string occurred today (local time).
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
 * Used for maintaining streaks.
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

export const canCompleteToday = (lastCompletedDate: string | null): boolean => {
  if (!lastCompletedDate) return true;
  return !isToday(lastCompletedDate);
};
