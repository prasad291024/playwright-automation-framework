import { test } from '@playwright/test';
import { OrangeHrmLoginPage } from '../../../src/pages/infrastructure';

const validScenario = {
  username: process.env.ORANGEHRM_USERNAME || 'Admin',
  password: process.env.ORANGEHRM_PASSWORD || 'admin123',
};

const invalidScenarios = [
  {
    name: 'invalid password',
    username: validScenario.username,
    password: `${validScenario.password}__invalid`,
  },
  {
    name: 'invalid username',
    username: `${validScenario.username}__invalid`,
    password: validScenario.password,
  },
];

test.describe('OrangeHRM Login Data', () => {
  test('@auth @orangehrm - login succeeds with valid credentials', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await loginPage.goto();

    await loginPage.login(validScenario.username, validScenario.password);
    await loginPage.assertLoginSuccess();
  });

  for (const scenario of invalidScenarios) {
    test(`@auth @orangehrm - login fails for ${scenario.name}`, async ({ page }) => {
      const loginPage = new OrangeHrmLoginPage(page);
      await loginPage.goto();

      await loginPage.login(scenario.username, scenario.password);
      await loginPage.assertLoginFailure();
    });
  }
});
