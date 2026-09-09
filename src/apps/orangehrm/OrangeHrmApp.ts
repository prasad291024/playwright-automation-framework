import { Page } from '@playwright/test';
import { OrangeHrmLoginPage } from '@pages/apps/orangehrm/pages/OrangeHrmLoginPage';
import { OrangeHrmDashboardPage } from '@pages/apps/orangehrm/pages/OrangeHrmDashboardPage';

/**
 * OrangeHRM App Facade - Encapsulates all page objects and provides higher-level user flows.
 */
export class OrangeHrmApp {
  readonly loginPage: OrangeHrmLoginPage;
  readonly dashboardPage: OrangeHrmDashboardPage;

  constructor(private readonly page: Page) {
    this.loginPage = new OrangeHrmLoginPage(page);
    this.dashboardPage = new OrangeHrmDashboardPage(page);
  }

  async goto(): Promise<void> {
    await this.loginPage.goto();
  }

  /**
   * Login to the OrangeHRM application.
   * @param username - The username to login with
   * @param password - The password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.login(username, password);
    await this.loginPage.assertLoginSuccess();
  }

  /**
   * Navigate to the dashboard after login.
   */
  async goToDashboard(): Promise<void> {
    await this.dashboardPage.goto();
    await this.dashboardPage.verifyDashboardVisible();
  }

  /**
   * Navigate to the Users module under Admin.
   */
  async navigateToUsers(): Promise<void> {
    await this.dashboardPage.navigateToUsers();
  }

  /**
   * Search for a user by username.
   * @param username - The username to search for
   */
  async searchUser(username: string): Promise<void> {
    await this.dashboardPage.searchUser(username);
  }

  /**
   * Verify that search results are present.
   */
  async verifySearchResultsPresent(): Promise<void> {
    await this.dashboardPage.verifySearchResultsPresent();
  }
}
