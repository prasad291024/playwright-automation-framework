import { test } from '@playwright/test';
import { VwoLoginPage } from '../../../src/pages/vwo.com/01-auth/VwoLoginPage';
import { isValidEmail } from '../../../src/utils/vwoAuth';

const VWO_EMAIL = process.env.VWO_EMAIL || process.env.USERNAME || '';
const VWO_PASSWORD = process.env.VWO_PASSWORD || process.env.PASSWORD || '';
const HAS_EMAIL_FORMAT = isValidEmail(VWO_EMAIL);

test.describe('VWO Login', () => {
  test.skip(
    !VWO_EMAIL || !VWO_PASSWORD || !HAS_EMAIL_FORMAT,
    'Set VWO_EMAIL (valid email format) and VWO_PASSWORD to run VWO auth tests.',
  );

  test('@smoke @vwo - login succeeds with valid email/password', async ({ page }) => {
    const loginPage = new VwoLoginPage(page);
    await loginPage.goto();

    await loginPage.login(VWO_EMAIL, VWO_PASSWORD);
    await loginPage.assertLoginSuccessful();
  });

  test('@smoke @vwo - login fails with invalid password', async ({ page }) => {
    const loginPage = new VwoLoginPage(page);
    await loginPage.goto();

    await loginPage.login(VWO_EMAIL, `${VWO_PASSWORD}__invalid`);
    await loginPage.assertInvalidLoginError();
  });
});
