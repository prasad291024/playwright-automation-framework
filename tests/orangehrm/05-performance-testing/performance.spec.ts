import { expect, test } from '@playwright/test';
import { OrangeHrmLoginPage } from '../../../src/pages/infrastructure';

const ORANGEHRM_USERNAME = process.env.ORANGEHRM_USERNAME || 'Admin';
const ORANGEHRM_PASSWORD = process.env.ORANGEHRM_PASSWORD || 'admin123';
const MAX_LOGIN_PAGE_LOAD_MS = Number(process.env.ORANGEHRM_MAX_LOGIN_PAGE_LOAD_MS || 6000);
const MAX_DASHBOARD_READY_MS = Number(process.env.ORANGEHRM_MAX_DASHBOARD_READY_MS || 12000);

test.describe('Performance: OrangeHRM', () => {
  test('@performance - login page becomes interactive within threshold', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    const start = Date.now();

    await loginPage.goto();

    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(MAX_LOGIN_PAGE_LOAD_MS);
  });

  test('@performance - dashboard is ready after login within threshold', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    const start = Date.now();

    await loginPage.goto();
    await loginPage.login(ORANGEHRM_USERNAME, ORANGEHRM_PASSWORD);
    await loginPage.assertLoginSuccess();

    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(MAX_DASHBOARD_READY_MS);
  });
});
