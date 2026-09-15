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
    test(`@auth @orangehrm - login fails for ${scenario.name}`, async ({ orangeHrmApp }) => {
      if (process.env.APP_NAME !== 'orangehrm') {
        test.skip();
        return;
      }

      // Start from login page (we need to logout first since auth fixture logs us in)
      await orangeHrmApp!.logout(); // This will take us to login page
      await orangeHrmApp!.goto();

      await orangeHrmApp!.loginPage.login(scenario.username, scenario.password);
      await orangeHrmApp!.loginPage.assertLoginFailure();
    });
  }
});
