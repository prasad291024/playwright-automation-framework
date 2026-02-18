import { test, expect } from '../fixture/auth.fixture';

test.describe('Authenticated Tests', () => {
  test('should load dashboard with authenticated session', async ({ authenticatedPage }) => {
    // authenticatedPage is pre-loaded with storage state from global-setup
    const baseURL = process.env.BASE_URL || 'https://your-app-url.com';
    await authenticatedPage.goto('/dashboard');

    // Verify authenticated state (e.g., user is logged in)
    // Example: check for logout button or user profile
    // await expect(authenticatedPage.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should access protected resource as authenticated user', async ({ authenticatedPage }) => {
    // Another authenticated test
    // Reuses the same storage state across tests in the same worker
  });
});
