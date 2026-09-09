import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

/**
 * OrangeHRM demo login page object.
 * Uses app-specific selectors from config.
 */
export class OrangeHrmLoginPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'orangehrm' as AppName);
  }

  async goto(): Promise<void> {
    // Clear cookies to ensure we start from a clean state (no existing session)
    await this.page.context().clearCookies();

    await this.page.goto(`${this.appConfig.baseUrl}${this.appConfig.authEndpoint}`);
    await this.waitForPageLoad();
    await expect(this.usernameInput()).toBeVisible({
      timeout: 15000,
    });
  }

  async login(username: string, password: string): Promise<void> {
    await this.stableFill(this.usernameInput(), username);
    await this.stableFill(this.passwordInput(), password);
    await this.stableClick(this.loginButton());
  }

  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/web\/index\.php\/dashboard/i, {
      timeout: this.appConfig.timeouts.navigation || 20000,
    });
    await expect(this.page.getByRole('heading', { name: /dashboard/i })).toBeVisible({
      timeout: 15000,
    });
  }

  async assertLoginFailure(): Promise<void> {
    await expect(this.page).toHaveURL(/\/auth\/login/i, {
      timeout: this.appConfig.timeouts.navigation || 20000,
    });
    await expect(this.page.getByText(/invalid credentials/i)).toBeVisible({
      timeout: this.appConfig.timeouts.page || 15000,
    });
  }

  private usernameInput(): Locator {
    const selector = this.getAppSelector('login', 'usernameInput');
    return selector ? this.locator(selector) : this.page.locator('[name="username"]');
  }

  private passwordInput(): Locator {
    const selector = this.getAppSelector('login', 'passwordInput');
    return selector ? this.locator(selector) : this.page.locator('[name="password"]');
  }

  private loginButton(): Locator {
    const selector = this.getAppSelector('login', 'loginButton');
    return selector ? this.locator(selector) : this.page.getByRole('button', { name: /login/i });
  }
}
