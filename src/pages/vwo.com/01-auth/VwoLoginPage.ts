import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../BasePage';

/**
 * VWO login page object.
 * Uses resilient locator fallbacks to support minor UI changes.
 */
export class VwoLoginPage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto(this.resolveLoginUrl());
    await expect(this.emailInput()).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput().fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput().fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton().click();
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
    return this.page
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
    return this.page
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
    return this.page.getByRole('button', { name: 'Sign in', exact: true });
  }

  private resolveLoginUrl(): string {
    const configuredBase = process.env.VWO_BASE_URL || 'https://app.vwo.com';

    if (/#\/login\/?$/i.test(configuredBase)) {
      return configuredBase;
    }

    return `${configuredBase.replace(/\/$/, '')}/#/login`;
  }
}
