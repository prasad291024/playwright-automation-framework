/**
 * Random Utilities
 * Helpers for generating random test data
 */

/**
 * Generate random string of specified length
 * @param length - Length of the random string
 * @param charset - Character set to use (default alphanumeric)
 */
export function getRandomString(length = 10, charset = 'abcdefghijklmnopqrstuvwxyz'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Generate random email address
 */
export function getRandomEmail(): string {
  return `user_${getRandomString(8)}@test.com`;
}

/**
 * Generate random number within range
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 */
export function getRandomNumber(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random phone number
 */
export function getRandomPhone(): string {
  return `${getRandomNumber(100, 999)}-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`;
}

/**
 * Generate random date within range
 * @param startDate - Start date
 * @param endDate - End date
 */
export function getRandomDate(startDate = new Date(2020, 0, 1), endDate = new Date()): Date {
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

/**
 * Shuffle array randomly
 * @param array - Array to shuffle
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 * @param array - Array to select from
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random boolean
 * @param probability - Probability of returning true (0-1)
 */
export function getRandomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}
