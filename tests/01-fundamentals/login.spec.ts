import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { getEnv } from '../../src/utils/envHelper';
import testUsers from '../../test-data/fixtures/login.testUsers.json';
import envLogin from '../../test-data/fixtures/login.env.json';

import { assertLoginSuccess, assertLoginFailure } from '../../src/utils/assertions';

// 🔐 Test with .env or fallback to envLogin.json
test('Login with environment credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const username = getEnv('USERNAME') || envLogin.username;
  const password = getEnv('PASSWORD') || envLogin.password;

  await loginPage.login(username, password);
  await assertLoginSuccess(page); // ✅ centralized assertion
});

// ✅ Data-driven tests for valid users
for (const user of testUsers.validUsers) {
  test(`Login succeeds for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await assertLoginSuccess(page); // ✅ centralized assertion
  });
}

// ❌ Data-driven tests for invalid users
for (const user of testUsers.invalidUsers) {
  test(`Login fails for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await assertLoginFailure(page); // ✅ centralized assertion
  });
}
