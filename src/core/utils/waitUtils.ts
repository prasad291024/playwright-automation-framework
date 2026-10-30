/**
 * Wait Utilities
 * Common waiting helper functions for stable element interactions
 */

import { expect, Page, Locator } from '@playwright/test';

/**
 * Wait for network idle and surface timeout failures.
 * @param page - Playwright page instance
 * @param maxWaitMs - Maximum time to wait
 */
export async function waitForNetworkIdle(page: Page, maxWaitMs = 5000): Promise<void> {
  // This helper explicitly promises network idle, so timeout must remain visible to callers.
  // eslint-disable-next-line playwright/no-networkidle
  await page.waitForLoadState('networkidle', { timeout: maxWaitMs });
}

/**
 * Wait for element visibility; Playwright interactions handle stability and animations.
 * @param locator - Playwright locator
 * @param timeout - Maximum wait time in ms
 */
export async function waitForStable(locator: Locator, timeout = 5000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
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
  await expect
    .poll(
      async () => {
        const results = await Promise.all(
          conditions.map(async (condition) => {
            try {
              return await condition();
            } catch {
              return false;
            }
          }),
        );
        return results.every((result) => result === true);
      },
      { timeout, message: `Conditions not met within ${timeout}ms` },
    )
    .toBe(true);
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
  await expect(locator).toHaveCount(count, { timeout });
}
