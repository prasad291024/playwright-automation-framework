import { test, expect } from '../../../src/core/fixtures/auth.fixture';

test.describe('Performance: OrangeHRM', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // We're already authenticated, just navigate to the dashboard
    await test.step('Navigate to dashboard', async () => {
      await authenticatedPage.waitForURL(/.*dashboard.*/);
    });
  });

  test('dashboard load performance @orangehrm @performance', async ({ authenticatedPage }) => {
    // Measure time to load dashboard
    const startTime = Date.now();
    await authenticatedPage.waitForLoadState('networkidle');
    const endTime = Date.now();

    const loadTime = endTime - startTime;
    console.log(`Dashboard load time: ${loadTime}ms`);

    // Assert that load time is reasonable (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);
  });

  test('menu navigation performance @orangehrm @performance', async ({
    authenticatedPage,
    orangeHrmApp,
    appName,
  }) => {
    if (appName !== 'orangehrm') {
      test.skip();
      return;
    }

    // Ensure starting state has PIM link not active
    const pimLink = authenticatedPage.getByRole('link', { name: /pim/i });
    const isPimActive = (await pimLink.getAttribute('class'))?.includes('active');
    if (isPimActive) {
      await orangeHrmApp!.dashboardPage.navigateToMenu('Dashboard');
    }
    await expect(pimLink).not.toHaveClass(/active/);

    // Measure time to navigate to PIM module
    const startTime = Date.now();
    await orangeHrmApp!.dashboardPage.navigateToMenu('PIM', { skipIfAlreadyActive: false });
    await authenticatedPage.waitForLoadState('networkidle');
    const endTime = Date.now();

    const navTime = endTime - startTime;
    console.log(`Menu navigation time: ${navTime}ms`);

    // Assert that navigation time is reasonable (under 3 seconds)
    expect(navTime).toBeLessThan(3000);
  });
});
