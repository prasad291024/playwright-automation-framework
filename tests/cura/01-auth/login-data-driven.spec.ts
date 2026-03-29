import { test } from '@playwright/test';
import { CuraLoginPage } from '../../../src/pages/infrastructure';
import { user } from '../../../src/apps/cura/test-data/users';

const validScenario = {
  username: process.env.CURA_USERNAME || user.username,
  password: process.env.CURA_PASSWORD || user.password,
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

test.describe('CURA Login Data', () => {
  test('@auth @cura - login succeeds with valid credentials', async ({ page }) => {
    const loginPage = new CuraLoginPage(page);
    await loginPage.goto();
    await loginPage.goToLogin();

    await loginPage.login(validScenario.username, validScenario.password);
    await loginPage.assertLoginSuccess();
  });

  for (const scenario of invalidScenarios) {
    test(`@auth @cura - login fails for ${scenario.name}`, async ({ page }) => {
      const loginPage = new CuraLoginPage(page);
      await loginPage.goto();
      await loginPage.goToLogin();

      await loginPage.login(scenario.username, scenario.password);
      await loginPage.assertLoginFailure();
    });
  }
});
