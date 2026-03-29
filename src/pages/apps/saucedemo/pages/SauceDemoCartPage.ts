import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

export class SauceDemoCartPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'saucedemo' as AppName);
  }

  async goto(): Promise<void> {
    await this.navigateTo('/cart.html');
    await expect(this.page).toHaveURL(/cart\.html/i);
  }

  async openCart(): Promise<void> {
    await this.stableClick(this.cartIcon());
  }

  async verifyItemPresent(): Promise<void> {
    await expect(this.cartItem().first()).toBeVisible();
  }

  private cartIcon(): Locator {
    const selector = this.getAppSelector('cart', 'cartIcon');
    return selector ? this.locator(selector) : this.page.locator('.shopping_cart_link');
  }

  private cartItem(): Locator {
    const selector = this.getAppSelector('cart', 'cartItem');
    return selector ? this.locator(selector) : this.page.locator('.cart_item');
  }
}
