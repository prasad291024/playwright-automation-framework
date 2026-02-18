import { test } from '../fixture/auth.fixture';

test.describe('Authenticated Tests', () => {
  test('should load dashboard with authenticated session', async () => {
    // TODO: uncomment and use authenticatedPage fixture when your app URL is configured
    // const { authenticatedPage } = await testContext;
    // authenticatedPage is pre-loaded with storage state from global-setup
    // await authenticatedPage.goto('/dashboard');
    // Verify authenticated state (e.g., user is logged in)
    // Example: check for logout button or user profile
    // await expect(authenticatedPage.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should access protected resource as authenticated user', async () => {
    // TODO: Another authenticated test
    // Reuses the same storage state across tests in the same worker
  });
});
