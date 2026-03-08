import { Locator } from '@playwright/test';
import { BasePage } from '../../../core/base/BasePage';

export class LoginPage extends BasePage {
  private usernameField: Locator;
  private passwordField: Locator;
  private loginButton: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.usernameField = this.page.locator('#txt-username');
    this.passwordField = this.page.locator('#txt-password');
    this.loginButton = this.page.locator('#btn-login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameField, username);
    await this.fill(this.passwordField, password);
    await this.click(this.loginButton);
  }
}