import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { getEnv } from '../../src/utils/envHelper';

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(process.env.USERNAME || '', process.env.PASSWORD || '');
  await loginPage.assertLoginSuccess();
  const username = getEnv('USERNAME');
  const password = getEnv('PASSWORD');
  await loginPage.login(username, password);
});