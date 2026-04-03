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
    await this.page.goto(this.appConfig.baseUrl);
    await this.waitForPageLoad();
    await expect(this.page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(this.usernameInput()).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.stableFill(this.usernameInput(), username);
    await this.stableFill(this.passwordInput(), password);
    await this.stableClick(this.loginButton());
  }

  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard\/index/i, {
      timeout: this.appConfig.timeouts.navigation,
    });
    await expect(this.page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  }

  async assertLoginFailure(): Promise<void> {
    await expect(this.page).toHaveURL(/\/auth\/login/i);
    await expect(this.page.getByText(/invalid credentials/i)).toBeVisible();
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
