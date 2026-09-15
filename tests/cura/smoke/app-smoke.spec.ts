import { test, expect } from '../../../src/core/fixtures/auth.fixture';

test('@smoke @cura - landing page shell renders correctly', async ({ authenticatedPage }) => {
  // The authenticated fixture logs us in, so we start from appointment page
  // To test the landing page shell, we need to logout first
  await authenticatedPage.context().clearCookies(); // Clear auth state to test login page

  // Reload page to get to login screen
  await authenticatedPage.reload();
  await authenticatedPage.waitForURL(/.*\/#\/login/); // Wait for login page

  await expect(
    authenticatedPage.getByRole('heading', { level: 1, name: /cura healthcare service/i }),
  ).toBeVisible();
  await expect(authenticatedPage.getByRole('link', { name: /make appointment/i })).toBeVisible();
});
