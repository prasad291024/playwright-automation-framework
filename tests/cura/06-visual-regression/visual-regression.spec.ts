import { expect, test } from '../../../src/core/fixtures/test.fixture';
import { user } from '../../../src/apps/cura/test-data/users';

test.use({ storageState: { cookies: [], origins: [] } });

const credentials = {
  username: process.env.CURA_USERNAME || user.username,
  password: process.env.CURA_PASSWORD || user.password,
};

test.describe('Visual Regression: CURA', () => {
  test('@visual - landing page shell matches baseline', async ({ curaApp }) => {
    await curaApp.goto();

    await expect(curaApp.loginPage.getPage()).toHaveScreenshot('cura-landing-shell.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('@visual - appointment form matches baseline after login', async ({ curaApp }) => {
    await curaApp.login(credentials.username, credentials.password);

    const appointmentSection = curaApp.appointmentPage.getPage().locator('#appointment');
    await expect(appointmentSection).toHaveScreenshot('cura-appointment-form.png', {
      animations: 'disabled',
    });
  });
});
