import { test } from '../../../src/core/fixtures/test.fixture';
import { resolveAppNameFromEnv } from '../../../src/core/auth/auth-session';
import { users } from '../../../src/apps/saucedemo/test-data/users';

// Override storageState to ensure we start fresh for login validation tests
test.use({ storageState: { cookies: [], origins: [] } });

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
      const appName = resolveAppNameFromEnv();
      if (appName !== 'saucedemo') {
        test.skip();
        return;
      }
      if (!saucedemoApp) {
        test.skip();
        return;
      }

      // Start from clean unauthenticated state (test.fixture provides clean page)
      await saucedemoApp.loginPage.goto();
      await saucedemoApp.loginPage.login(scenario.username, scenario.password);
      await saucedemoApp.loginPage.assertLoginFailure();
    });
  }
});
