import { expect, test } from '@playwright/test';
import { SauceDemoLoginPage } from '../../../src/pages/infrastructure';
import { users } from '../../../src/apps/saucedemo/test-data/users';

const MAX_LOGIN_PAGE_LOAD_MS = Number(process.env.SAUCEDEMO_MAX_LOGIN_PAGE_LOAD_MS || 4000);
const MAX_INVENTORY_READY_MS = Number(process.env.SAUCEDEMO_MAX_INVENTORY_READY_MS || 7000);

test.describe('Performance: SauceDemo', () => {
  test('@performance - login page becomes interactive within threshold', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    const start = Date.now();

    await loginPage.goto();

    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(MAX_LOGIN_PAGE_LOAD_MS);
  });

  test('@performance - inventory page is ready after login within threshold', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    const start = Date.now();

    await loginPage.goto();
    await loginPage.login(users.standard_user.username, users.standard_user.password);
    await loginPage.assertLoginSuccess();

    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(MAX_INVENTORY_READY_MS);
  });
});
