import { Page } from '@playwright/test';
import { SauceDemoLoginPage } from '@pages/apps/saucedemo/pages/SauceDemoLoginPage';
import { SauceDemoInventoryPage } from '@pages/apps/saucedemo/pages/SauceDemoInventoryPage';
import { SauceDemoCartPage } from '@pages/apps/saucedemo/pages/SauceDemoCartPage';

/**
 * SauceDemo App Facade - Encapsulates all page objects and provides higher-level user flows.
 */
export class SauceDemoApp {
  readonly loginPage: SauceDemoLoginPage;
  readonly inventoryPage: SauceDemoInventoryPage;
  readonly cartPage: SauceDemoCartPage;

  constructor(private readonly page: Page) {
    this.loginPage = new SauceDemoLoginPage(page);
    this.inventoryPage = new SauceDemoInventoryPage(page);
    this.cartPage = new SauceDemoCartPage(page);
  }

  async goto(): Promise<void> {
    await this.loginPage.goto();
  }

  /**
   * Login to the SauceDemo application.
   * @param username - The username to login with
   * @param password - The password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.login(username, password);
    await this.loginPage.assertLoginSuccess();
  }

  /**
   * Add items to the cart by their names.
   * @param itemNames - Array of item names to add to cart
   */
  async addItemsToCart(itemNames: string[]): Promise<void> {
    await this.inventoryPage.goto();
    // This would need to be implemented in the inventory page
    // For now, we'll add the first items as a placeholder
    for (let i = 0; i < Math.min(itemNames.length, 3); i++) {
      await this.inventoryPage.addFirstProductToCart();
    }
  }

  /**
   * Go to the cart page.
   */
  async goToCart(): Promise<void> {
    await this.inventoryPage.goto();
    await this.inventoryPage.clickCartIcon();
    await this.cartPage.goto();
  }

  /**
   * Complete the checkout process.
   */
  async checkout(): Promise<void> {
    await this.cartPage.clickCheckout();
    // Would need to implement checkout steps
  }
}
