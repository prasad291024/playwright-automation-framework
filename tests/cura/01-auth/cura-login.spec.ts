import { test } from '@playwright/test';
import { CuraLoginPage } from '../../../src/pages/infrastructure';

const CURA_USERNAME = process.env.CURA_USERNAME || 'John Doe';
const CURA_PASSWORD = process.env.CURA_PASSWORD || 'ThisIsNotAPassword';

test.describe('CURA Login', () => {
  test('@smoke @cura - login succeeds with valid credentials', async ({ page }) => {
    const curaLoginPage = new CuraLoginPage(page);
    await curaLoginPage.goto();
    await curaLoginPage.goToLogin();

    await curaLoginPage.login(CURA_USERNAME, CURA_PASSWORD);
    await curaLoginPage.assertLoginSuccess();
  });

  test('@smoke @cura - login fails with invalid password', async ({ page }) => {
    const curaLoginPage = new CuraLoginPage(page);
    await curaLoginPage.goto();
    await curaLoginPage.goToLogin();

    await curaLoginPage.login(CURA_USERNAME, `${CURA_PASSWORD}__invalid`);
    await curaLoginPage.assertLoginFailure();
  });
});
