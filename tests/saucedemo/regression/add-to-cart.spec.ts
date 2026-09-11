import { test } from '../../../src/core/fixtures/test.fixture';
import { users } from '../../../src/apps/saucedemo/test-data/users';

test('user can add product to cart', async ({ saucedemoApp }) => {
  await saucedemoApp.login(users.standard_user.username, users.standard_user.password);
  await saucedemoApp.inventoryPage.verifyInventoryLoaded();
  await saucedemoApp.inventoryPage.addFirstProductToCart();
  await saucedemoApp.inventoryPage.clickCartIcon();
  await saucedemoApp.cartPage.verifyItemPresent();
});
