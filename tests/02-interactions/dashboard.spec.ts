import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { getEnv } from '../../src/utils/envHelper';
import { waitForElement } from '../../src/utils/waitForElement';
import { getProfileLink } from '../../src/utils/envUtils';


test('Dashboard loads and links are visible', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  const username = getEnv('USERNAME');
  const password = getEnv('PASSWORD');

  await loginPage.goto();
  await loginPage.login(username, password);
  await dashboardPage.verifyWelcomeSection();

  await waitForElement(page, getProfileLink());
  await dashboardPage.navigateToProfile();
});
