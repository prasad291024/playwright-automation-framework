import { test } from '../../../src/core/fixtures/auth.fixture';

/**
 * OrangeHRM Dashboard Access Smoke Test
 *
 * This test demonstrates authenticated access to OrangeHRM dashboard
 * using the authenticated fixture rather than performing login steps.
 */
test.describe('@smoke @orangehrm - Dashboard Access', () => {
  test('should access dashboard after authentication', async ({
    authenticatedPage,
    orangeHrmApp,
    appName,
  }) => {
    if (appName !== 'orangehrm') {
      test.skip();
      return;
    }
    if (!orangeHrmApp) {
      test.skip();
      return;
    }

    // Verify we're on the dashboard page (authenticated fixture handles login)
    await authenticatedPage.waitForURL(/.*dashboard.*/);

    // Verify dashboard is visible
    await orangeHrmApp!.dashboardPage.verifyDashboardVisible();

    // Verify we can access key dashboard elements
    await orangeHrmApp!.dashboardPage.verifyMenuOptionVisible('Admin');
    await orangeHrmApp!.dashboardPage.verifyMenuOptionVisible('PIM');
    await orangeHrmApp!.dashboardPage.verifyMenuOptionVisible('Leave');
    await orangeHrmApp!.dashboardPage.verifyMenuOptionVisible('Time');

    // Verify user info is displayed
    await orangeHrmApp!.dashboardPage.verifyUserDropdownVisible();
  });

  test('should be able to navigate to PIM module from dashboard', async ({
    authenticatedPage,
    orangeHrmApp,
    appName,
  }) => {
    if (appName !== 'orangehrm') {
      test.skip();
      return;
    }
    if (!orangeHrmApp) {
      test.skip();
      return;
    }

    // Start from dashboard (authenticated fixture handles login)
    await authenticatedPage.waitForURL(/.*dashboard.*/);

    // Navigate to PIM module
    await orangeHrmApp!.dashboardPage.navigateToMenu('PIM');

    // Verify we're on the PIM employee list page
    await authenticatedPage.waitForURL(/.*pim.*/);

    // Verify PIM page is loaded
    await orangeHrmApp!.dashboardPage.verifyPageHeading('Employee Information');
  });
});
