import { expect, test } from '../../../src/core/fixtures/test.fixture';

const ORANGEHRM_USERNAME = process.env.ORANGEHRM_USERNAME || 'Admin';
const ORANGEHRM_PASSWORD = process.env.ORANGEHRM_PASSWORD || 'admin123';

test.describe('Visual Regression: OrangeHRM', () => {
  test('@visual - login page shell matches baseline', async ({ orangeHrmApp }) => {
    await orangeHrmApp.goto();

    await expect(orangeHrmApp.loginPage.getPage()).toHaveScreenshot('orangehrm-login-shell.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('@visual - dashboard banner matches baseline after login', async ({ orangeHrmApp }) => {
    await orangeHrmApp.login(ORANGEHRM_USERNAME, ORANGEHRM_PASSWORD);

    const banner = orangeHrmApp.dashboardPage.getPage().getByRole('banner');
    await expect(banner).toHaveScreenshot('orangehrm-dashboard-banner.png', {
      animations: 'disabled',
    });
  });
});
