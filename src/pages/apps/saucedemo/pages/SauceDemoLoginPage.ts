import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

/**
 * SauceDemo login page object.
 * Uses app-specific selectors from config.
 */
export class SauceDemoLoginPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'saucedemo' as AppName);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.appConfig.baseUrl);
    await this.waitForPageLoad();
    await expect(this.usernameInput()).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async fillUsername(username: string): Promise<void> {
    await this.stableFill(this.usernameInput(), username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.stableFill(this.passwordInput(), password);
  }

  async clickLogin(): Promise<void> {
    await this.stableClick(this.loginButton());
  }

  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.page.getByText('Products')).toBeVisible();
  }

  async assertLoginFailure(): Promise<void> {
    await expect(this.page.getByText(/epic sadface/i)).toBeVisible();
    await expect(this.page).toHaveURL(/\/$/);
  }

  private usernameInput(): Locator {
    const selector = this.getAppSelector('login', 'usernameInput');
    return selector ? this.locator(selector) : this.page.locator('#user-name');
  }

  private passwordInput(): Locator {
    const selector = this.getAppSelector('login', 'passwordInput');
    return selector ? this.locator(selector) : this.page.locator('#password');
  }

  private loginButton(): Locator {
    const selector = this.getAppSelector('login', 'loginButton');
    return selector ? this.locator(selector) : this.page.locator('#login-button');
  }
}
