/**
 * Wait Utilities
 * Common waiting helper functions for stable element interactions
 */

import { Page, Locator } from '@playwright/test';

/**
 * Wait for network idle with fallback
 * @param page - Playwright page instance
 * @param maxWaitMs - Maximum time to wait
 */
export async function waitForNetworkIdle(page: Page, maxWaitMs = 5000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout: maxWaitMs });
  } catch {
    // Fallback if network never goes idle
    await page.waitForTimeout(500);
  }
}

/**
 * Wait for element to be stable (visible and animations complete)
 * @param locator - Playwright locator
 * @param timeout - Maximum wait time in ms
 */
export async function waitForStable(locator: Locator, timeout = 5000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
  // Small delay for animations
  await locator.page()?.waitForTimeout(300);
}

/**
 * Wait for multiple conditions to be true
 * @param conditions - Array of async condition functions
 * @param timeout - Maximum wait time in ms
 */
export async function waitForAllConditions(
  conditions: (() => Promise<boolean>)[],
  timeout = 5000,
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const results = await Promise.all(conditions.map((cond) => cond().catch(() => false)));
    if (results.every((result) => result === true)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Conditions not met within ${timeout}ms`);
}

/**
 * Wait for element count to match expected
 * @param locator - Playwright locator
 * @param count - Expected number of elements
 * @param timeout - Maximum wait time in ms
 */
export async function waitForElementCount(
  locator: Locator,
  count: number,
  timeout = 5000,
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const actualCount = await locator.count();
    if (actualCount === count) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Expected ${count} elements but not found within ${timeout}ms`);
}
