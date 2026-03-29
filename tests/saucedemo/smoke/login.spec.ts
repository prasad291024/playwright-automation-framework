import { test } from '@playwright/test';
import { SauceDemoInventoryPage, SauceDemoLoginPage } from '../../../src/pages/infrastructure';
import { users } from '../../../src/apps/saucedemo/test-data/users';

test('user can login successfully', async ({ page }) => {
  const loginPage = new SauceDemoLoginPage(page);
  await loginPage.goto();

  await loginPage.login(users.standard_user.username, users.standard_user.password);

  const inventory = new SauceDemoInventoryPage(page);
  await inventory.verifyInventoryLoaded();
});
