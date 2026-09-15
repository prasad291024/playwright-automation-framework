import { test } from '../../../src/core/fixtures/auth.fixture';

test('@smoke @saucedemo - user can login successfully', async ({
  authenticatedPage,
  saucedemoApp,
}) => {
  // The authenticated fixture already logs us in, so we just verify we're on the right page
  await authenticatedPage.waitForURL(/.*inventory.*/);

  // Verify we can access app-specific functionality
  await saucedemoApp.inventoryPage.verifyInventoryLoaded();
});
