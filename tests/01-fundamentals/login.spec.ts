import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { getEnv } from '../../src/utils/envHelper';
import testUsers from './testData/login.testUsers.json';
import envLogin from './testData/login.env.json';

// 🔐 Test with .env or fallback to envLogin.json
test('Login with environment credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const username = getEnv('USERNAME') || envLogin.username;
  const password = getEnv('PASSWORD') || envLogin.password;

  await loginPage.login(username, password);
  await loginPage.assertLoginSuccess();
});

// ✅ Data-driven tests for valid users
for (const user of testUsers.validUsers) {
  test(`Login succeeds for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await loginPage.assertLoginSuccess();
  });
}

// ❌ Data-driven tests for invalid users
for (const user of testUsers.invalidUsers) {
  test(`Login fails for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await loginPage.assertLoginFailure(); // Define this in LoginPage
  });
}
