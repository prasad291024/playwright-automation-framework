import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

/**
 * CURA demo app login page object.
 * Uses app-specific selectors from config.
 */
export class CuraLoginPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'cura' as AppName);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.appConfig.baseUrl);
    await this.waitForPageLoad();
    await expect(
      this.page.getByRole('heading', { level: 1, name: /cura healthcare service/i }),
    ).toBeVisible();
  }

  async goToLogin(): Promise<void> {
    const makeAppointmentLink = this.page
      .getByRole('link', { name: /make appointment/i })
      .or(this.page.locator('#btn-make-appointment'));
    await this.stableClick(makeAppointmentLink.first());
    await expect(this.usernameInput()).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.stableFill(this.usernameInput(), username);
    await this.stableFill(this.passwordInput(), password);
    await this.stableClick(this.loginButton());
  }

  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/#appointment|appointment\.php/i);
    await expect(this.page.getByRole('heading', { name: /make appointment/i })).toBeVisible();
  }

  async assertLoginFailure(): Promise<void> {
    await expect(this.page.getByText(/login failed/i)).toBeVisible();
    await expect(this.page).toHaveURL(/#login|profile\.php#login/i);
  }

  private usernameInput(): Locator {
    const selector = this.getAppSelector('login', 'usernameInput');
    return selector ? this.locator(selector) : this.page.locator('#txt-username');
  }

  private passwordInput(): Locator {
    const selector = this.getAppSelector('login', 'passwordInput');
    return selector ? this.locator(selector) : this.page.locator('#txt-password');
  }

  private loginButton(): Locator {
    const selector = this.getAppSelector('login', 'loginButton');
    return selector ? this.locator(selector) : this.page.locator('#btn-login');
  }
}
