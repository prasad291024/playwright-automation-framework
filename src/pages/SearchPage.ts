import { expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { ISearchPage } from '../interface/pages.interface';
import { SELECTORS_BY_TESTID, SELECTORS } from '../utils/selectors';

/**
 * Search Page Object Model
 * Handles search interactions and result assertions
 */
export class SearchPage extends BasePage implements ISearchPage {
  /**
   * Navigate to search page (homepage with search feature)
   */
  async goto(): Promise<void> {
    await this.page.goto('https://playwright.dev/');
    await this.waitForPageLoad();
  }

  /**
   * Perform search for a term
   */
  async searchFor(term: string): Promise<void> {
    // Use getByRole for searchbox - most accessible
    await this.getByRole('searchbox').fill(term);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Assert search results contain specific text
   */
  async assertResultsContain(text: string): Promise<void> {
    await expect(this.locator(SELECTORS.search.results)).toContainText(text);
  }

  /**
   * Assert no search results are displayed
   */
  async assertNoResults(): Promise<void> {
    await expect(
      this.getByTestId(SELECTORS_BY_TESTID.search.noResults).or(
        this.locator(SELECTORS.search.noResults),
      ),
    ).toBeVisible();
  }
}
