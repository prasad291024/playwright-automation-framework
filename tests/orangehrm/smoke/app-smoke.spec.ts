import { test, expect } from '../../../src/core/fixtures/auth.fixture';

test('@smoke @orangehrm - login page shell renders correctly', async ({ authenticatedPage }) => {
  // The authenticated fixture logs us in, so we start from dashboard page
  // To test the login page shell, we need to logout first
  await authenticatedPage.context().clearCookies(); // Clear auth state to test login page

  // Reload page to get to login screen
  await authenticatedPage.reload();
  await authenticatedPage.waitForURL(/.*\/web\/index\.php\/auth\/login/); // Wait for login page

  await expect(authenticatedPage.locator('[name="username"]')).toBeVisible();
  await expect(authenticatedPage.locator('[type="submit"]')).toBeVisible();
});
