import { test } from '../../../src/core/fixtures/auth.fixture';
import { OrangeHrmDashboardPage } from '../../../src/pages/infrastructure';

test.describe('OrangeHRM Dashboard Regression', () => {
  test('authenticated user can view dashboard after login', async ({
    authenticatedPage,
    appName,
    authSession,
  }) => {
    test.skip(appName !== 'orangehrm', 'This regression test is scoped to the OrangeHRM app.');
    test.skip(
      !authSession.authenticated,
      'Shared auth fixture could not establish an OrangeHRM session for this run.',
    );

    const dashboard = new OrangeHrmDashboardPage(authenticatedPage);
    await dashboard.goto();
    await dashboard.verifyDashboardVisible();
  });

  test('authenticated user can search for a user via admin module', async ({
    authenticatedPage,
    appName,
    authSession,
  }) => {
    test.skip(appName !== 'orangehrm', 'This regression test is scoped to the OrangeHRM app.');
    test.skip(
      !authSession.authenticated,
      'Shared auth fixture could not establish an OrangeHRM session for this run.',
    );

    const dashboard = new OrangeHrmDashboardPage(authenticatedPage);
    await dashboard.goto();
    await dashboard.verifyDashboardVisible();

    await dashboard.navigateToUsers();
    await dashboard.searchUser('Admin');
    await dashboard.verifySearchResultsPresent();
  });
});
