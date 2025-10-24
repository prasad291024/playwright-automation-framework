import { Page, expect } from '@playwright/test';

export class SearchPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://playwright.dev/');
  }

  async searchFor(term: string) {
    await this.page.getByPlaceholder('Search').click();
    await this.page.getByPlaceholder('Search').fill(term);
    await this.page.keyboard.press('Enter');
  }

  async assertResultsContain(text: string) {
    await expect(this.page.locator('article')).toContainText(text);
  }
  async assertNoResults() {
  await expect(this.page.locator('article')).toHaveCount(0); // Adjust selector if needed
}

}
