import { Page } from '@playwright/test';

/**
 * Base Page Class
 *
 * Provides common functionality for all page objects:
 * - Page instance management
 * - Common navigation patterns
 * - Shared utility methods
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
   * @param placeholder - The placeholder text
   */
  protected getByPlaceholder(placeholder: string) {
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
   * Wait for page to reach a stable state
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to a relative path
   * @param path - Relative path (e.g., '/dashboard', '/profile')
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
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
