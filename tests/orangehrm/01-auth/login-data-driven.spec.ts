import { test } from '../../../src/core/fixtures/auth.fixture';

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
    test(`@auth @orangehrm - login fails for ${scenario.name}`, async ({
      orangeHrmApp,
      appName,
    }) => {
      // Skip test if not running for OrangeHRM
      if (appName !== 'orangehrm') {
        test.skip();
        return;
      }

      // orangeHrmApp is guaranteed to be defined when appName is 'orangehrm'
      await orangeHrmApp!.goto();

      await orangeHrmApp!.loginPage.login(scenario.username, scenario.password);
      await orangeHrmApp!.loginPage.assertLoginFailure();
    });
  }
});
