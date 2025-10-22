import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  // Locators
  usernameInput = this.page.locator('#username');
  passwordInput = this.page.locator('#password');
  loginButton = this.page.locator('button[type="submit"]');

  // Actions
  async goto() {
    await this.page.goto(process.env.BASE_URL || 'https://your-app-url.com');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.page.locator('text=Welcome')).toBeVisible();
  }
}