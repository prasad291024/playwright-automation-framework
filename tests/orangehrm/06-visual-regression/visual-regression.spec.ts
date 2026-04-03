import { expect, test } from '@playwright/test';
import { OrangeHrmLoginPage } from '../../../src/pages/infrastructure';

const ORANGEHRM_USERNAME = process.env.ORANGEHRM_USERNAME || 'Admin';
const ORANGEHRM_PASSWORD = process.env.ORANGEHRM_PASSWORD || 'admin123';

test.describe('Visual Regression: OrangeHRM', () => {
  test('@visual - login page shell matches baseline', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await loginPage.goto();

    await expect(page).toHaveScreenshot('orangehrm-login-shell.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('@visual - dashboard banner matches baseline after login', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await loginPage.goto();
    await loginPage.login(ORANGEHRM_USERNAME, ORANGEHRM_PASSWORD);
    await loginPage.assertLoginSuccess();

    const banner = page.getByRole('banner');
    await expect(banner).toHaveScreenshot('orangehrm-dashboard-banner.png', {
      animations: 'disabled',
    });
  });
});
