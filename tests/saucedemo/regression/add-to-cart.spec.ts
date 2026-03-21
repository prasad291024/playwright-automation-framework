import { test } from '../../../src/core/fixtures/auth.fixture';
import { InventoryPage } from '../../../src/apps/saucedemo/pages/InventoryPage';
import { CartPage } from '../../../src/apps/saucedemo/pages/CartPage';

test('user can add product to cart', async ({ authenticatedPage, appName, authSession }) => {
  test.skip(appName !== 'saucedemo', 'This regression test is scoped to the SauceDemo app.');
  test.skip(
    !authSession.authenticated,
    'Shared auth fixture could not establish a SauceDemo session for this run.',
  );

  const inventory = new InventoryPage(authenticatedPage);
  await inventory.verifyInventoryLoaded();
  await inventory.addFirstProductToCart();

  const cart = new CartPage(authenticatedPage);
  await cart.openCart();
  await cart.verifyItemPresent();
});
