import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

/**
 * VWO login page object.
 * Uses app-specific selectors from config.
 */
export class VwoLoginPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'vwo' as AppName);
  }

  async goto(): Promise<void> {
    await this.page.goto(`${this.appConfig.baseUrl}${this.appConfig.authEndpoint}`);
    await this.waitForPageLoad();
    await expect(this.emailInput()).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async fillEmail(email: string): Promise<void> {
    await this.stableFill(this.emailInput(), email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.stableFill(this.passwordInput(), password);
  }

  async clickSignIn(): Promise<void> {
    await this.stableClick(this.signInButton());
  }

  async assertLoginSuccessful(): Promise<void> {
    await expect(this.page).not.toHaveURL(/#\/login/);
  }

  async assertInvalidLoginError(): Promise<void> {
    await expect(
      this.page.getByText(
        /did not match|invalid|incorrect|wrong|failed|try again|email, password, IP address/i,
      ),
    ).toBeVisible();
    await expect(this.page).toHaveURL(/#\/login/);
  }

  private emailInput(): Locator {
    const selector = this.getAppSelector('login', 'emailInput');
    return selector
      ? this.locator(selector)
      : this.page
          .locator(
            [
              'input[placeholder*="email" i]',
              'input[name="email"]',
              'input[name="username"]',
              'input[type="email"]',
            ].join(','),
          )
          .first();
  }

  private passwordInput(): Locator {
    const selector = this.getAppSelector('login', 'passwordInput');
    return selector
      ? this.locator(selector)
      : this.page
          .locator(
            [
              'input[placeholder*="password" i]',
              'input[name="password"]',
              'input[type="password"]',
            ].join(','),
          )
          .first();
  }

  private signInButton(): Locator {
    const selector = this.getAppSelector('login', 'signInButton');
    return selector
      ? this.locator(selector)
      : this.page.getByRole('button', { name: 'Sign in', exact: true });
  }
}
