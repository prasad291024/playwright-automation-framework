import { test } from '@playwright/test';
import { SauceDemoLoginPage } from '../../../src/pages/infrastructure';
import { users } from '../../../src/apps/saucedemo/test-data/users';

const invalidScenarios = [
  {
    name: 'standard user with invalid password',
    username: users.standard_user.username,
    password: `${users.standard_user.password}__invalid`,
  },
  {
    name: 'locked out user',
    username: users.locked_out_user.username,
    password: users.locked_out_user.password,
  },
];

test.describe('SauceDemo Login Data', () => {
  test('@auth @saucedemo - standard user can login successfully', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.goto();

    await loginPage.login(users.standard_user.username, users.standard_user.password);
    await loginPage.assertLoginSuccess();
  });

  for (const scenario of invalidScenarios) {
    test(`@auth @saucedemo - login fails for ${scenario.name}`, async ({ page }) => {
      const loginPage = new SauceDemoLoginPage(page);
      await loginPage.goto();

      await loginPage.login(scenario.username, scenario.password);
      await loginPage.assertLoginFailure();
    });
  }
});
