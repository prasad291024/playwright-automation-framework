import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(process.env.USERNAME || '', process.env.PASSWORD || '');
  await loginPage.assertLoginSuccess();
});