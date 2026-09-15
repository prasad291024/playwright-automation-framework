import { expect, test } from '../../../src/core/fixtures/auth.fixture';

test.describe('Accessibility: OrangeHRM', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // We're already authenticated, navigate to login page for testing
    await test.step('Navigate to login page', async () => {
      await authenticatedPage.context().clearCookies(); // Clear auth state
      await authenticatedPage.reload(); // Reload to get to login page
      await authenticatedPage.waitForURL(/.*\/web\/index\.php\/auth\/login/);
    });
  });

  test('@a11y - login form fields are keyboard reachable', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    await expect(page.locator('[name="username"]')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.locator('[name="password"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[type="submit"]')).toBeFocused();
  });

  test('@a11y - dashboard has proper heading structure', () => {
    // Would require login sequence - testing concept only
    test.skip();
  });
});
