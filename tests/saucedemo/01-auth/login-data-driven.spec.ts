import { test } from '../../../src/core/fixtures/test.fixture';
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

test.describe('SauceDemo Login Validation', () => {
  for (const scenario of invalidScenarios) {
    test(`@auth @saucedemo - login fails for ${scenario.name}`, async ({ saucedemoApp }) => {
      await saucedemoApp.loginPage.goto();
      await saucedemoApp.loginPage.login(scenario.username, scenario.password);
      await saucedemoApp.loginPage.assertLoginFailure();
    });
  }
});
