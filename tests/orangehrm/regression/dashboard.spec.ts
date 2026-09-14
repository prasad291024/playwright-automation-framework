import { test } from '../../../src/core/fixtures/test.fixture';

test.describe('OrangeHRM Dashboard Regression', () => {
  test('authenticated user can view dashboard after login', async ({ orangeHrmApp }) => {
    test.skip(
      process.env.APP_NAME !== 'orangehrm',
      'This regression test is scoped to the OrangeHRM app.',
    );
    test.skip(!orangeHrmApp, 'OrangeHRM app fixture not available for this test configuration.');

    await orangeHrmApp.dashboardPage.goto();
    await orangeHrmApp.dashboardPage.verifyDashboardVisible();
  });

  test('authenticated user can search for a user via admin module', async ({ orangeHrmApp }) => {
    test.skip(
      process.env.APP_NAME !== 'orangehrm',
      'This regression test is scoped to the OrangeHRM app.',
    );
    test.skip(!orangeHrmApp, 'OrangeHRM app fixture not available for this test configuration.');

    await orangeHrmApp.dashboardPage.goto();
    await orangeHrmApp.dashboardPage.verifyDashboardVisible();

    await orangeHrmApp.dashboardPage.navigateToUsers();
    await orangeHrmApp.dashboardPage.searchUser('Admin');
    await orangeHrmApp.dashboardPage.verifySearchResultsPresent();
  });
});
