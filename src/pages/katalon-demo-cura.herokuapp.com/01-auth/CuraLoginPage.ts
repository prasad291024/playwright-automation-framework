import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../BasePage';

/**
 * CURA demo app login page object.
 */
export class CuraLoginPage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto(this.resolveBaseUrl());
    await expect(
      this.page.getByRole('heading', { level: 1, name: /cura healthcare service/i }),
    ).toBeVisible();
  }

  async goToLogin(): Promise<void> {
    const makeAppointmentLink = this.page
      .getByRole('link', { name: /make appointment/i })
      .or(this.page.locator('#btn-make-appointment'));
    await makeAppointmentLink.first().click();
    await expect(this.usernameInput()).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
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
    return this.page.locator('#txt-username');
  }

  private passwordInput(): Locator {
    return this.page.locator('#txt-password');
  }

  private loginButton(): Locator {
    return this.page.locator('#btn-login');
  }

  private resolveBaseUrl(): string {
    return process.env.CURA_BASE_URL || 'https://katalon-demo-cura.herokuapp.com';
  }
}
