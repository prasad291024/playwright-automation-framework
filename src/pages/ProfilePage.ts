import { expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { IProfilePage } from '../interface/pages.interface';
import { SELECTORS_BY_TESTID, SELECTORS } from '../utils/selectors';

/**
 * Profile Page Object Model
 * Handles user profile interactions and assertions
 */
export class ProfilePage extends BasePage implements IProfilePage {
  /**
   * Navigate to profile page
   */
  async goto(): Promise<void> {
    await this.navigateTo('/profile');
    await this.waitForPageLoad();
  }

  /**
   * Update user name
   */
  async updateName(newName: string): Promise<void> {
    const nameInputLocator = this.getByTestId(SELECTORS_BY_TESTID.profile.nameInput).or(
      this.locator(SELECTORS.profile.nameInput),
    );

    await nameInputLocator.clear();
    await nameInputLocator.fill(newName);
    await this.clickSaveButton();
  }

  /**
   * Click save button
   */
  private async clickSaveButton(): Promise<void> {
    await this.getByRole('button', { name: /save|update/i }).click();
  }

  /**
   * Verify name was updated successfully
   */
  async assertNameUpdated(newName: string): Promise<void> {
    await expect(
      this.getByTestId(SELECTORS_BY_TESTID.profile.nameDisplay).or(
        this.locator(SELECTORS.profile.nameDisplay),
      ),
    ).toHaveText(newName);
  }
}
