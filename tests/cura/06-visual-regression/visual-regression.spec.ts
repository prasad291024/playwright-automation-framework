import { test, expect } from '../../../src/core/fixtures/auth.fixture';

test.describe('Visual Regression: CURA', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // We're already authenticated, just navigate to the landing page
    await test.step('Navigate to landing page', async () => {
      await authenticatedPage.waitForURL(/.*\/#\/login/);
    });
  });

  test('landing page visual regression @cura @visual', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('body')).toHaveScreenshot('cura-landing-chromium.png');
  });
});
