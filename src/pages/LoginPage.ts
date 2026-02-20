import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ILoginPage } from '../interface/pages.interface';
import { SELECTORS_BY_TESTID, SELECTORS } from '../utils/selectors';

/**
 * Login Page Object Model
 * Handles all login-related interactions and assertions
 */
export class LoginPage extends BasePage implements ILoginPage {
  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Fill username/email field
   * Prefers data-testid, falls back to role-based locator
   */
  async fillUsername(username: string): Promise<void> {
    await this.getByTestId(SELECTORS_BY_TESTID.login.usernameInput).fill(username);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.getByTestId(SELECTORS_BY_TESTID.login.passwordInput).fill(password);
  }

  /**
   * Click login button
   * Prefers role-based locator for accessibility
   */
  async clickLoginButton(): Promise<void> {
    await this.getByRole('button', { name: /login|sign in/i }).click();
  }

  /**
   * Complete login flow with username and password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify successful login by checking for welcome message
   */
  async assertLoginSuccess(): Promise<void> {
    await expect(this.getByText(/welcome|dashboard|logged in/i).first()).toBeVisible();
  }

  /**
   * Verify login failed by checking for error message
   */
  async assertLoginFailure(): Promise<void> {
    await expect(
      this.getByTestId(SELECTORS_BY_TESTID.login.errorMessage).or(
        this.locator(SELECTORS.login.errorMessage),
      ),
    ).toBeVisible();
  }
}
