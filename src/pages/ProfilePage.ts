import { Page, expect } from '@playwright/test';
import { SELECTORS } from '../utils/selectors';

export class ProfilePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://your-app.com/profile'); // adjust URL
  }

  async updateName(newName: string) {
    await this.page.locator(SELECTORS.profile.nameInput).fill(newName);
    await this.page.locator(SELECTORS.profile.saveButton).click();
  }

  async assertNameUpdated(newName: string) {
    await expect(this.page.locator(SELECTORS.profile.nameDisplay)).toHaveText(newName);
  }
}
