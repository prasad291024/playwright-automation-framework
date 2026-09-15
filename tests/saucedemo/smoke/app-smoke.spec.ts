import { test, expect } from '../../../src/core/fixtures/auth.fixture';

test('@smoke @saucedemo - login page shell renders correctly', async ({ authenticatedPage }) => {
  // The authenticated fixture logs us in, so we start from inventory page
  // To test the login page shell, we need to logout first
  await authenticatedPage.context().clearCookies(); // Clear auth state to test login page

  // Reload page to get to login screen
  await authenticatedPage.reload();
  await authenticatedPage.waitForURL(/.*\/$/); // Wait for login page

  await expect(authenticatedPage.getByTestId('username')).toBeVisible();
  await expect(authenticatedPage.getByText(/accepted usernames are:/i)).toBeVisible();
});
