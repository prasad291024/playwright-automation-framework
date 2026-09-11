import { test } from '../../../src/core/fixtures/test.fixture';
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

test.describe('CURA Login Validation', () => {
  for (const scenario of invalidScenarios) {
    test(`@auth @cura - login fails for ${scenario.name}`, async ({ curaApp }) => {
      await curaApp.loginPage.goto();
      await curaApp.loginPage.goToLogin();

      await curaApp.loginPage.login(scenario.username, scenario.password);
      await curaApp.loginPage.assertLoginFailure();
    });
  }
});
