import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

test('Dashboard loads and links are visible', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login(process.env.USERNAME || '', process.env.PASSWORD || '');

  await dashboardPage.verifyWelcomeMessage();
  await dashboardPage.navigateToProfile();
  await page.goBack();
  await dashboardPage.navigateToSettings();
});