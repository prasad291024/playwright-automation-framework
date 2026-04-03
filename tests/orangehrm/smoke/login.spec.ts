import { test } from '@playwright/test';
import { OrangeHrmLoginPage } from '../../../src/pages/infrastructure';

const ORANGEHRM_USERNAME = process.env.ORANGEHRM_USERNAME || process.env.USERNAME || 'Admin';
const ORANGEHRM_PASSWORD = process.env.ORANGEHRM_PASSWORD || process.env.PASSWORD || 'admin123';

test.describe('OrangeHRM Login', () => {
  test('@smoke @orangehrm - login succeeds with valid credentials', async ({ page }) => {
    const orangeHrmLoginPage = new OrangeHrmLoginPage(page);
    await orangeHrmLoginPage.goto();

    await orangeHrmLoginPage.login(ORANGEHRM_USERNAME, ORANGEHRM_PASSWORD);
    await orangeHrmLoginPage.assertLoginSuccess();
  });
});
