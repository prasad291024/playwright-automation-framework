import { Locator } from '@playwright/test';
import { BasePage } from '../../../core/base/BasePage';

export class InventoryPage extends BasePage {
  private inventoryList: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.inventoryList = this.page.locator('.inventory_list');
  }

  async verifyInventoryLoaded(): Promise<void> {
    await this.assertVisible(this.inventoryList);
  }

  async addFirstProductToCart(): Promise<void> {
    const firstAddButton = this.page.locator('.inventory_item button').first();
    await this.click(firstAddButton);
  }
}