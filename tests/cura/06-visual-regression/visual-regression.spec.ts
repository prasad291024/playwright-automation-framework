import { expect, test } from '@playwright/test';
import { CuraLoginPage } from '../../../src/pages/infrastructure';
import { user } from '../../../src/apps/cura/test-data/users';

const CURA_USERNAME = process.env.CURA_USERNAME || user.username;
const CURA_PASSWORD = process.env.CURA_PASSWORD || user.password;

test.describe('Visual Regression: CURA', () => {
  test('@visual - landing page shell matches baseline', async ({ page }) => {
    const loginPage = new CuraLoginPage(page);
    await loginPage.goto();

    await expect(page).toHaveScreenshot('cura-landing-shell.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('@visual - appointment form matches baseline after login', async ({ page }) => {
    const loginPage = new CuraLoginPage(page);
    await loginPage.goto();
    await loginPage.goToLogin();
    await loginPage.login(CURA_USERNAME, CURA_PASSWORD);
    await loginPage.assertLoginSuccess();

    const appointmentSection = page.locator('#appointment');
    await expect(appointmentSection).toHaveScreenshot('cura-appointment-form.png', {
      animations: 'disabled',
    });
  });
});
