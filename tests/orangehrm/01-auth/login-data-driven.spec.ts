import { test } from '../../../src/core/fixtures/test.fixture';
import { resolveAppNameFromEnv } from '../../../src/core/auth/auth-session';
import { PUBLIC_DEMO_CREDENTIALS } from '../../../src/config/public-demo-credentials';

// Override storageState to ensure we start fresh for login validation tests
test.use({ storageState: { cookies: [], origins: [] } });

const validScenario = {
  username: process.env.ORANGEHRM_USERNAME || PUBLIC_DEMO_CREDENTIALS.orangehrm.username,
  password: process.env.ORANGEHRM_PASSWORD || PUBLIC_DEMO_CREDENTIALS.orangehrm.password,
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
      const appName = resolveAppNameFromEnv();
      if (appName !== 'orangehrm') {
        test.skip();
        return;
      }

      // Start from clean unauthenticated state (test.fixture provides clean page)
      await orangeHrmApp.loginPage.goto();
      await orangeHrmApp.loginPage.login(scenario.username, scenario.password);
      await orangeHrmApp.loginPage.assertLoginFailure();
    });
  }
});
