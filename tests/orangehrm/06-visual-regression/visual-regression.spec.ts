import { test, expect } from '../../../src/core/fixtures/auth.fixture';

test.describe('Visual Regression: OrangeHRM', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // We're already authenticated, just navigate to the dashboard
    await test.step('Navigate to dashboard', async () => {
      await authenticatedPage.waitForURL(/.*dashboard.*/);
    });
  });

  test('dashboard visual regression @orangehrm @visual', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('body')).toHaveScreenshot(
      'orangehrm-dashboard-chromium.png',
    );
  });
});
