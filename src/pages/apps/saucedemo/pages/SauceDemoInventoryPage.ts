import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

export class SauceDemoInventoryPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'saucedemo' as AppName);
  }

  async goto(): Promise<void> {
    await this.navigateTo('/inventory.html');
    await this.verifyInventoryLoaded();
  }

  async verifyInventoryLoaded(): Promise<void> {
    await expect(this.inventoryList()).toBeVisible();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.stableClick(this.addToCartButton().first());
  }

  private inventoryList(): Locator {
    const selector = this.getAppSelector('inventory', 'inventoryList');
    return selector ? this.locator(selector) : this.page.locator('.inventory_list');
  }

  private addToCartButton(): Locator {
    const selector = this.getAppSelector('inventory', 'addToCartButton');
    return selector ? this.locator(selector) : this.page.locator('.inventory_item button');
  }
}
