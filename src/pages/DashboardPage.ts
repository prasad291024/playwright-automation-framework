import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  // Locators
  welcomeMessage = this.page.locator('h1.welcome'); // Adjust selector as needed
  profileLink = this.page.locator('a[href="/profile"]');
  settingsLink = this.page.locator('a[href="/settings"]');

  // Actions
  async verifyWelcomeMessage() {
    await expect(this.welcomeMessage).toBeVisible();
  }

  async navigateToProfile() {
    await this.profileLink.click();
  }

  async navigateToSettings() {
    await this.settingsLink.click();
  }
  async verifyWelcomeSection() {
  await expect(this.page.locator('h1.welcome')).toBeVisible(); // adjust selector as needed
  }

}