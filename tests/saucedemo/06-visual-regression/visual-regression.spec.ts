import { expect, test } from '@playwright/test';
import { SauceDemoLoginPage } from '../../../src/pages/infrastructure';
import { users } from '../../../src/apps/saucedemo/test-data/users';

test.describe('Visual Regression: SauceDemo', () => {
  test('@visual - login page shell matches baseline', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.goto();

    await expect(page).toHaveScreenshot('saucedemo-login-shell.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('@visual - inventory content matches baseline after login', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard_user.username, users.standard_user.password);
    await loginPage.assertLoginSuccess();

    const inventoryContainer = page.locator('.inventory_container');
    await expect(inventoryContainer).toHaveScreenshot('saucedemo-inventory-container.png', {
      animations: 'disabled',
    });
  });
});
