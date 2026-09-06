import { test } from '../../../src/core/fixtures/auth.fixture';
import { SauceDemoCartPage, SauceDemoInventoryPage } from '../../../src/pages/infrastructure';

// Example: Configure retry behavior for this test suite
// Uncomment to override the global retry configuration:
// test.describe.configure({ retries: 2 }); // Suite-level retry override

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
