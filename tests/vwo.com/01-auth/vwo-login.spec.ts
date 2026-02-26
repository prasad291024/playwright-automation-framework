import { test } from '@playwright/test';
import { VwoLoginPage } from '../../../src/pages/VwoLoginPage';

const BASE_URL = process.env.BASE_URL || 'https://app.vwo.com';
const VWO_EMAIL = process.env.VWO_EMAIL || process.env.USERNAME || '';
const VWO_PASSWORD = process.env.VWO_PASSWORD || process.env.PASSWORD || '';

test.describe('VWO Login', () => {
  test.skip(
    !VWO_EMAIL || !VWO_PASSWORD,
    'Set VWO_EMAIL and VWO_PASSWORD (or USERNAME/PASSWORD) to run VWO auth tests.',
  );

  test('@smoke @vwo - login succeeds with valid email/password', async ({ page }) => {
    const loginPage = new VwoLoginPage(page);
    await page.goto(`${BASE_URL}/#/login`);

    await loginPage.login(VWO_EMAIL, VWO_PASSWORD);
    await loginPage.assertLoginSuccessful();
  });

  test('@smoke @vwo - login fails with invalid password', async ({ page }) => {
    const loginPage = new VwoLoginPage(page);
    await page.goto(`${BASE_URL}/#/login`);

    await loginPage.login(VWO_EMAIL, `${VWO_PASSWORD}__invalid`);
    await loginPage.assertInvalidLoginError();
  });
});
