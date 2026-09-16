import { test } from '../../../src/core/fixtures/auth.fixture';

test.describe('OrangeHRM Dashboard Regression', () => {
  test('authenticated user can view dashboard after login', async ({ orangeHrmApp, appName }) => {
    if (appName !== 'orangehrm') {
      test.skip();
      return;
    }
    if (!orangeHrmApp) {
      test.skip();
      return;
    }

    // We're already on dashboard due to auth fixture
    await orangeHrmApp!.dashboardPage.verifyDashboardVisible();
  });

  test('authenticated user can search for a user via admin module', async ({
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

    // We're already on dashboard due to auth fixture
    await orangeHrmApp!.dashboardPage.verifyDashboardVisible();

    await orangeHrmApp!.dashboardPage.navigateToUsers();
    await orangeHrmApp!.dashboardPage.searchUser('Admin');
    await orangeHrmApp!.dashboardPage.verifySearchResultsPresent();
  });
});
