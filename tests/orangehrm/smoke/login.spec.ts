import { test } from '../../../src/core/fixtures/auth.fixture';

test('@smoke @orangehrm - login succeeds with valid credentials', async ({
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

  // The authenticated fixture already logs us in, so we just verify we're on the right page
  await authenticatedPage.waitForURL(/.*dashboard.*/);

  // Verify we can access app-specific functionality
  await orangeHrmApp!.dashboardPage.verifyDashboardVisible();
});
