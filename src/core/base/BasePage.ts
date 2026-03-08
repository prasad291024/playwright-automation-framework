import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Class
 *
 * Provides common functionality for all page objects:
 * - Page instance management
 * - Common navigation patterns
 * - Shared utility methods
 */
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Click on a locator
   * @param locator - The locator to click
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Fill a locator with text
   * @param locator - The locator to fill
   * @param value - The text value to fill
   */
  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  /**
   * Wait for a locator to be visible
   * @param locator - The locator to wait for
   */
  async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  /**
   * Assert that a locator is visible
   * @param locator - The locator to assert
   */
  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
