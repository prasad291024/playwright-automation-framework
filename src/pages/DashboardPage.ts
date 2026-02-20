import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { IDashboardPage } from '../interface/pages.interface';
import { SELECTORS_BY_TESTID, SELECTORS } from '../utils/selectors';

/**
 * Dashboard Page Object Model
 * Handles dashboard interactions and assertions
 */
export class DashboardPage extends BasePage implements IDashboardPage {
  /**
   * Navigate to dashboard page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/dashboard');
    await this.waitForPageLoad();
  }

  /**
   * Verify welcome message is visible
   */
  async verifyWelcomeMessage(): Promise<void> {
    await expect(
      this.getByTestId(SELECTORS_BY_TESTID.dashboard.welcomeHeader).or(
        this.locator(SELECTORS.dashboard.welcomeHeader),
      ),
    ).toBeVisible();
  }

  /**
   * Navigate to profile page
   */
  async navigateToProfile(): Promise<void> {
    await this.getByRole('link', { name: /profile/i }).click();
  }

  /**
   * Navigate to settings page
   */
  async navigateToSettings(): Promise<void> {
    await this.getByRole('link', { name: /settings/i }).click();
  }
}
