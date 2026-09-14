import { test } from '../../../src/core/fixtures/test.fixture';

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

test.describe('OrangeHRM Login Validation', () => {
  for (const scenario of invalidScenarios) {
    test(`@auth @orangehrm - login fails for ${scenario.name}`, async ({ orangeHrmApp }) => {
      if (process.env.APP_NAME !== 'orangehrm') {
        test.skip();
        return;
      }

      await orangeHrmApp.goto();

      await orangeHrmApp.loginPage.login(scenario.username, scenario.password);
      await orangeHrmApp.loginPage.assertLoginFailure();
    });
  }
});
