import { test } from '../../../src/core/fixtures/auth.fixture';
import { VwoLoginPage } from '../../../src/pages/infrastructure';

const VWO_EMAIL = process.env.VWO_EMAIL || process.env.USERNAME || '';
const VWO_PASSWORD = process.env.VWO_PASSWORD || process.env.PASSWORD || '';

test.describe('VWO Login', () => {
  test.skip(
    true,
    'VWO test app is no longer supported and credentials are unavailable. Skipping all VWO tests.',
  );

  test('@smoke @vwo - login succeeds with valid email/password', async ({ page, appName }) => {
    test.skip(appName !== 'vwo', 'This test is only for VWO app');

    const loginPage = new VwoLoginPage(page);
    await loginPage.goto();

    await loginPage.login(VWO_EMAIL, VWO_PASSWORD);
    await loginPage.assertLoginSuccessful();
  });

  test('@smoke @vwo - login fails with invalid password', async ({ page, appName }) => {
    test.skip(appName !== 'vwo', 'This test is only for VWO app');

    const loginPage = new VwoLoginPage(page);
    await loginPage.goto();

    await loginPage.login(VWO_EMAIL, `${VWO_PASSWORD}__invalid`);
    await loginPage.assertInvalidLoginError();
  });
});
