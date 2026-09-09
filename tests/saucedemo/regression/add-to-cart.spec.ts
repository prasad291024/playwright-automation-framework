import { test } from '@playwright/test';
import {
  SauceDemoCartPage,
  SauceDemoInventoryPage,
  SauceDemoLoginPage,
} from '../../../src/pages/infrastructure';
import { users } from '../../../src/apps/saucedemo/test-data/users';

test('user can add product to cart', async ({ page }) => {
  const loginPage = new SauceDemoLoginPage(page);
  await loginPage.goto();

  await loginPage.login(users.standard_user.username, users.standard_user.password);

  const inventory = new SauceDemoInventoryPage(page);
  await inventory.verifyInventoryLoaded();
  await inventory.addFirstProductToCart();

  const cart = new SauceDemoCartPage(page);
  await cart.openCart();
  await cart.verifyItemPresent();
});
