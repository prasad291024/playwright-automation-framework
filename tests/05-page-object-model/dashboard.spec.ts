import { test } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';

test('Dashboard loads with welcome message and profile link', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await dashboard.assertWelcomeMessage();
  await dashboard.assertProfileLinkVisible();
});
