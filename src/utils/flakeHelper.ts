/**
 * Flakiness Reduction Utilities
 *
 * Provides stable, resilient patterns for handling common flaky scenarios:
 * - Retries with exponential backoff
 * - Improved wait strategies
 * - Resilient element interactions
 * - Network stability checks
 */

import { Page, Locator } from '@playwright/test';

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number; // 1.5 = exponential backoff
  onAttempt?: (attempt: number, error: Error) => void;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 200,
  backoffMultiplier: 1.5,
};

/**
 * Retry a function with exponential backoff
 * Useful for flaky operations like API calls, element interactions, etc.
 *
 * @example
 * const result = await retryWithBackoff(async () => {
 *   return await page.getByRole('button').click();
 * }, { maxAttempts: 3 });
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | null = null;
  let delay = opts.delayMs || 200;

  for (let attempt = 1; attempt <= (opts.maxAttempts || 3); attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      opts.onAttempt?.(attempt, lastError);

      if (attempt < (opts.maxAttempts || 3)) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= opts.backoffMultiplier || 1.5;
      }
    }
  }

  throw new Error(`Operation failed after ${opts.maxAttempts} attempts: ${lastError?.message}`);
}

/**
 * Wait for network to become idle, with fallback strategy
 * If networkidle times out, falls back to a short delay
 *
 * Useful when:
 * - Network is slow but predictable
 * - App doesn't fully stabilize on networkidle
 * - We need to wait for animations to complete
 */
export async function waitForNetworkStable(
  page: Page,
  options: {
    minNetworkIdleMs?: number; // how long page must be quiet
    maxWaitMs?: number; // max total wait
  } = {},
): Promise<void> {
  const minNetworkIdleMs = options.minNetworkIdleMs || 2000;
  const maxWaitMs = options.maxWaitMs || 15000;

  try {
    await page.waitForLoadState('networkidle', { timeout: maxWaitMs });
  } catch (e) {
    // Fallback: page might not reach perfect network idle, just wait a bit
    console.warn(
      `Network idle timeout after ${maxWaitMs}ms, falling back to ${minNetworkIdleMs}ms delay`,
    );
    await page.waitForTimeout(minNetworkIdleMs);
  }
}

/**
 * Wait for multiple conditions to be true
 * Useful for complex page states (element visible + text matches + animation complete)
 *
 * @example
 * await waitForConditions(page, [
 *   () => page.getByText('Loading...').isHidden(),
 *   () => page.getByTestId('content').isVisible(),
 * ]);
 */
export async function waitForConditions(
  page: Page,
  conditions: (() => Promise<boolean>)[],
  timeout: number = 10000,
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    let allMet = true;

    for (const condition of conditions) {
      try {
        if (!(await condition())) {
          allMet = false;
          break;
        }
      } catch {
        allMet = false;
        break;
      }
    }

    if (allMet) {
      return;
    }

    await page.waitForTimeout(100);
  }

  throw new Error(`Conditions not met within ${timeout}ms`);
}

/**
 * Stable click: retries if element is not clickable
 * Handles cases where element might be covered, disabled, or not yet interactive
 */
export async function stableClick(
  locator: Locator,
  options: { timeout?: number; force?: boolean } = {},
): Promise<void> {
  return retryWithBackoff(
    async () => {
      await locator.click({
        timeout: options.timeout || 8000,
        force: options.force,
      });
    },
    {
      maxAttempts: 3,
      delayMs: 300,
      onAttempt: (attempt) => {
        if (attempt > 1) {
          console.warn(`Click attempt ${attempt}, retrying...`);
        }
      },
    },
  );
}

/**
 * Stable fill: retries if input cannot be filled
 * Handles cases where input is not ready or has focus issues
 */
export async function stableFill(
  locator: Locator,
  text: string,
  options: { timeout?: number; clearFirst?: boolean } = {},
): Promise<void> {
  return retryWithBackoff(
    async () => {
      if (options.clearFirst !== false) {
        await locator.clear({ timeout: options.timeout || 5000 });
      }
      await locator.fill(text, { timeout: options.timeout || 8000 });
    },
    {
      maxAttempts: 3,
      delayMs: 300,
      onAttempt: (attempt) => {
        if (attempt > 1) {
          console.warn(`Fill attempt ${attempt} for "${text.substring(0, 20)}...", retrying...`);
        }
      },
    },
  );
}

/**
 * Resilient type: slower typing to avoid input overflow
 * Useful when rapid input causes issues
 */
export async function resilientType(
  locator: Locator,
  text: string,
  options: { delayBetweenCharsMs?: number } = {},
): Promise<void> {
  const delayMs = options.delayBetweenCharsMs || 50;
  await locator.focus();

  for (const char of text) {
    await locator.type(char, { delay: delayMs });
  }
}

/**
 * Wait for element to be in a stable state (visible + not animating)
 * Useful for elements that might be hiding/showing with animations
 */
export async function waitForStableVisibility(
  locator: Locator,
  timeout: number = 8000,
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      // Check if visible
      if (await locator.isVisible()) {
        // Wait a bit to ensure animation is complete
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Double-check it's still visible after animation
        if (await locator.isVisible()) {
          return;
        }
      }
    } catch {
      // Element not yet attached, continue waiting
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Element did not become stably visible within ${timeout}ms`);
}

/**
 * Check if element would be in viewport (useful for scroll-heavy pages)
 */
export async function isInViewport(locator: Locator): Promise<boolean> {
  try {
    const box = await locator.boundingBox();
    if (!box) return false;

    const page = locator.page();
    const viewport = page.viewportSize();
    if (!viewport) return false;

    return (
      box.y + box.height > 0 &&
      box.y < viewport.height &&
      box.x + box.width > 0 &&
      box.x < viewport.width
    );
  } catch {
    return false;
  }
}

/**
 * Scroll element into view with retry
 * Useful for elements that might be off-screen or in sticky headers
 */
export async function scrollIntoViewStable(locator: Locator): Promise<void> {
  return retryWithBackoff(
    async () => {
      await locator.scrollIntoViewIfNeeded({ timeout: 8000 });
      // Brief wait for scroll to complete
      await new Promise((resolve) => setTimeout(resolve, 200));
    },
    { maxAttempts: 2, delayMs: 100 },
  );
}

/**
 * Expect with retry: useful for assertions that might temporarily fail
 * due to loading states or animations
 *
 * @example
 * await expectWithRetry(
 *   () => expect(page.getByText('Loaded')).toBeVisible(),
 *   { maxAttempts: 5 }
 * );
 */
export async function expectWithRetry(
  assertionFn: () => Promise<void>,
  config: RetryConfig = {},
): Promise<void> {
  return retryWithBackoff(assertionFn, { ...DEFAULT_RETRY_CONFIG, ...config });
}

/**
 * Multiple selector strategies with fallback
 * Returns first locator that exists and is visible
 *
 * @example
 * const button = await findElement(page, [
 *   page.getByRole('button', { name: 'Submit' }),
 *   page.getByTestId('submit-btn'),
 *   page.locator('#submit'),
 * ]);
 */
export async function findElement(page: Page, locators: Locator[]): Promise<Locator | null> {
  for (const locator of locators) {
    try {
      const count = await locator.count();
      if (count > 0) {
        try {
          const isVisible = await locator.isVisible({ timeout: 1000 });
          if (isVisible) {
            return locator;
          }
        } catch {
          // Element exists but not visible, continue
        }
      }
    } catch {
      // Locator doesn't match, continue
    }
  }

  return null;
}

/**
 * Debug helper: takes screenshot and logs page state on failure
 */
export async function debugPageState(
  page: Page,
  reason: string = 'Debug checkpoint',
): Promise<void> {
  const url = page.url();
  const title = await page.title();
  console.log(`\n📸 [${reason}]`);
  console.log(`   URL: ${url}`);
  console.log(`   Title: ${title}`);

  try {
    await page.screenshot({
      path: `test-results/debug-${Date.now()}.png`,
      fullPage: false,
    });
    console.log(`   Screenshot saved`);
  } catch (e) {
    console.warn(`   Could not save screenshot:`, (e as Error).message);
  }
}
