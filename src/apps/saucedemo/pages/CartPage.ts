import { Locator } from '@playwright/test';
import { BasePage } from '../../../core/base/BasePage';

export class CartPage extends BasePage {
  private cartIcon: Locator;
  private cartItemsContainer: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.cartIcon = this.page.locator('.shopping_cart_link');
    this.cartItemsContainer = this.page.locator('.cart_item');
  }

  async openCart(): Promise<void> {
    await this.click(this.cartIcon);
  }

  async verifyItemPresent(): Promise<void> {
    await this.assertVisible(this.cartItemsContainer.first());
  }
}
