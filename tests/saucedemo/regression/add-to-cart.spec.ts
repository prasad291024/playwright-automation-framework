import { test } from '../../../src/core/fixtures/auth.fixture';
import { SauceDemoCartPage, SauceDemoInventoryPage } from '../../../src/pages/infrastructure';

test('user can add product to cart', async ({ authenticatedPage, appName, authSession }) => {
  test.skip(appName !== 'saucedemo', 'This regression test is scoped to the SauceDemo app.');
  test.skip(
    !authSession.authenticated,
    'Shared auth fixture could not establish a SauceDemo session for this run.',
  );

  const inventory = new SauceDemoInventoryPage(authenticatedPage);
  await inventory.verifyInventoryLoaded();
  await inventory.addFirstProductToCart();

  const cart = new SauceDemoCartPage(authenticatedPage);
  await cart.openCart();
  await cart.verifyItemPresent();
});
