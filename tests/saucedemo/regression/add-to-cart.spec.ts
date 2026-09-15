import { test } from '../../../src/core/fixtures/auth.fixture';

test('user can add product to cart', async ({ authenticatedPage, saucedemoApp, appName }) => {
  if (appName !== 'saucedemo' || !saucedemoApp) {
    test.skip();
    return;
  }

  // The authenticated fixture already logs us in, so we just verify we're on the right page
  await authenticatedPage.waitForURL(/.*inventory.*/);

  // Verify inventory is loaded
  await saucedemoApp!.inventoryPage.verifyInventoryLoaded();

  // Add product to cart
  await saucedemoApp!.inventoryPage.addFirstProductToCart();
  await saucedemoApp!.inventoryPage.clickCartIcon();

  // Verify item is in cart
  await saucedemoApp!.cartPage.verifyItemPresent();
});
