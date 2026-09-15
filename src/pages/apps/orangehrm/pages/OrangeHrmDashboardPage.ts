import { expect } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

/**
 * OrangeHRM dashboard page object.
 * Encapsulates interactions and assertions for the authenticated dashboard view.
 */
export class OrangeHrmDashboardPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'orangehrm' as AppName);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.appConfig.baseUrl);
    await this.waitForPageLoad();
  }

  /**
   * Verify the dashboard is loaded and accessible.
   * Checks for the dashboard heading and side navigation.
   */
  async verifyDashboardVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard\/index/i, {
      timeout: this.appConfig.timeouts.navigation,
    });
    await expect(this.page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await expect(this.page.getByRole('navigation', { name: /sidepanel/i })).toBeVisible();
  }

  /**
   * Navigate to a menu item in the sidebar
   * @param menuItem - The menu item to navigate to (e.g., 'Admin', 'PIM', 'Leave')
   */
  async navigateToMenu(menuItem: string): Promise<void> {
    await this.stableClick(this.page.getByRole('link', { name: new RegExp(menuItem, 'i') }));
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify a menu option is visible in the sidebar
   * @param menuOption - The menu option to verify (e.g., 'User Management', 'Job', 'Organization')
   */
  async verifyMenuOptionVisible(menuOption: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: new RegExp(menuOption, 'i') })).toBeVisible();
  }

  /**
   * Verify a menu item is visible in the sidebar
   * @param menuItem - The menu item to verify (e.g., 'Admin', 'PIM', 'Leave')
   */
  async verifyMenuItemVisible(menuItem: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: new RegExp(menuItem, 'i') })).toBeVisible();
  }

  /**
   * Navigate to the Users module under Admin.
   */
  async navigateToUsers(): Promise<void> {
    await this.stableClick(this.page.getByRole('link', { name: /admin/i }));
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByRole('heading', { name: /users/i })).toBeVisible({
      timeout: this.appConfig.timeouts.navigation,
    });
  }

  /**
   * Verify the user dropdown is visible
   */
  async verifyUserDropdownVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: /user/i })).toBeVisible();
  }

  /**
   * Verify the page heading is visible
   * @param headingText - The expected heading text
   */
  async verifyPageHeading(headingText: string): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: new RegExp(headingText, 'i') }),
    ).toBeVisible();
  }

  /**
   * Perform a user search by username.
   */
  async searchUser(username: string): Promise<void> {
    const searchInput = this.page.getByPlaceholder(/search/i);
    await this.stableFill(searchInput, username);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify at least one search result row is present.
   */
  async verifySearchResultsPresent(): Promise<void> {
    const results = this.page.locator('.oxd-table-body .oxd-table-row');
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  }
}
