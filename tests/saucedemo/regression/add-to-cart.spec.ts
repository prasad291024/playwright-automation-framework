import { test } from '@playwright/test';
import { LoginPage } from '../../../src/apps/saucedemo/pages/LoginPage';
import { InventoryPage } from '../../../src/apps/saucedemo/pages/InventoryPage';
import { CartPage } from '../../../src/apps/saucedemo/pages/CartPage';
import { users } from '../../../src/apps/saucedemo/test-data/users';

test('user can add product to cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate('https://www.saucedemo.com');
  await loginPage.login(users.standard_user.username, users.standard_user.password);

  const inventory = new InventoryPage(page);
  await inventory.addFirstProductToCart();

  const cart = new CartPage(page);
  await cart.openCart();
  await cart.verifyItemPresent();
});