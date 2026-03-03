import { Page } from '@playwright/test';
import {
  waitForNetworkStable,
  waitForConditions,
  stableClick,
  stableFill,
  resilientType,
  waitForStableVisibility,
  scrollIntoViewStable,
  debugPageState,
  findElement,
  expectWithRetry,
  type RetryConfig,
} from '../utils/flakeHelper';

/**
 * Base Page Class
 *
 * Provides common functionality for all page objects:
 * - Page instance management
 * - Common navigation patterns
 * - Shared utility methods
 * - Flakiness-resistant interaction methods
 */
export abstract class BasePage {
  protected baseUrl: string;

  constructor(protected page: Page) {
    this.baseUrl = process.env.BASE_URL || 'https://your-app-url.com';
  }

  /**
   * Navigate to the page
   * Subclasses should override this with their specific URL
   */
  abstract goto(): Promise<void>;

  /**
   * Get a locator by data-testid attribute (preferred)
   * @param testId - The data-testid value
   */
  protected getByTestId(testId: string) {
    return this.page.getByTestId(testId);
  }

  /**
   * Get a locator by role (accessible and resilient)
   * @param role - The ARIA role (button, link, textbox, etc.)
   * @param options - Additional options like name
   */
  protected getByRole(
    role: 'button' | 'link' | 'textbox' | 'heading' | 'article' | 'searchbox' | 'status' | 'list',
    options?: { name?: string | RegExp; exact?: boolean; level?: number },
  ) {
    return this.page.getByRole(
      role as
        | 'button'
        | 'link'
        | 'textbox'
        | 'heading'
        | 'article'
        | 'searchbox'
        | 'status'
        | 'list',
      options,
    );
  }

  /**
   * Get a locator by placeholder text
   * @param placeholder - The placeholder text or regex
   */
  protected getByPlaceholder(placeholder: string | RegExp) {
    if (placeholder instanceof RegExp) {
      return this.page.getByPlaceholder(placeholder);
    }
    return this.page.getByPlaceholder(placeholder);
  }

  /**
   * Get a locator by visible text
   * @param text - The text to find
   */
  protected getByText(text: string | RegExp) {
    return this.page.getByText(text);
  }

  /**
   * Generic locator method for CSS selectors and XPath
   * Use sparingly - prefer getByTestId, getByRole, getByPlaceholder
   * @param selector - CSS selector or XPath
   */
  protected locator(selector: string) {
    return this.page.locator(selector);
  }

  /**
   * Wait for page to reach a stable state (network idle + animations)
   * Uses fallback strategy if network never fully idles
   */
  async waitForPageLoad(): Promise<void> {
    await waitForNetworkStable(this.page, { maxWaitMs: 15000 });
  }

  /**
   * Wait for multiple conditions to be true simultaneously
   * Useful for complex page states
   */
  protected async waitForConditions(
    conditions: (() => Promise<boolean>)[],
    timeout?: number,
  ): Promise<void> {
    await waitForConditions(this.page, conditions, timeout);
  }

  /**
   * Navigate to a relative path with improved stability
   * @param path - Relative path (e.g., '/dashboard', '/profile')
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
    await this.waitForPageLoad();
  }

  /**
   * Stable click with retry logic
   * Use this instead of locator.click() for flaky elements
   */
  protected async stableClick(locator: ReturnType<typeof this.getByRole>, force = false) {
    await stableClick(locator, { force });
  }

  /**
   * Stable fill with retry logic
   * Use this instead of locator.fill() for flaky inputs
   */
  protected async stableFill(locator: ReturnType<typeof this.getByRole>, text: string) {
    await stableFill(locator, text);
  }

  /**
   * Resilient typing (slower character-by-character input)
   * Use for inputs that overflow or have validation issues
   */
  protected async resilientType(locator: ReturnType<typeof this.getByRole>, text: string) {
    await resilientType(locator, text);
  }

  /**
   * Wait for element to be in stable state (visible + animation complete)
   */
  protected async waitForStableVisibility(locator: ReturnType<typeof this.getByRole>) {
    await waitForStableVisibility(locator);
  }

  /**
   * Scroll element into view with retry
   */
  protected async scrollIntoView(locator: ReturnType<typeof this.getByRole>) {
    await scrollIntoViewStable(locator);
  }

  /**
   * Find element from multiple selector strategies
   * Returns first locator that exists and is visible
   */
  protected async findElement(locators: ReturnType<typeof this.getByRole>[]) {
    return findElement(this.page, locators);
  }

  /**
   * Assertion with retry logic
   * Useful when elements take time to load or update
   */
  protected async expectWithRetry(assertionFn: () => Promise<void>, config?: RetryConfig | number) {
    const retryConfig =
      typeof config === 'number' ? { maxAttempts: config } : (config as RetryConfig);
    await expectWithRetry(assertionFn, retryConfig);
  }

  /**
   * Debug helper: log page state and take screenshot
   */
  protected async debugPageState(reason?: string) {
    await debugPageState(this.page, reason);
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Close the page
   */
  async close(): Promise<void> {
    await this.page.close();
  }
}
