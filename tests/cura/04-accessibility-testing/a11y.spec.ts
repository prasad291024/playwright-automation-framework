import { expect, test } from '../../../src/core/fixtures/auth.fixture';

test.describe('Accessibility: CURA', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // We're already authenticated, navigate to login page for testing
    await test.step('Navigate to login page', async () => {
      await authenticatedPage.context().clearCookies(); // Clear auth state
      await authenticatedPage.reload(); // Reload to get to login page
      await authenticatedPage.waitForURL(/.*\/#\/login/);
    });
  });

  test('@a11y - homepage has a clear primary heading and CTA', async ({ authenticatedPage }) => {
    await expect(
      authenticatedPage.getByRole('heading', { level: 1, name: /cura healthcare service/i }),
    ).toBeVisible();
    await expect(authenticatedPage.getByRole('link', { name: /make appointment/i })).toBeVisible();
  });

  test('@a11y - login form fields are keyboard reachable', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('#txt-username')).toBeVisible();
    await authenticatedPage.keyboard.press('Tab');
    await expect(authenticatedPage.locator('#txt-password')).toBeFocused();
  });
});
