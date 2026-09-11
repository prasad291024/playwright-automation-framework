import { expect, test } from '../../../src/core/fixtures/test.fixture';
import { user } from '../../../src/apps/cura/test-data/users';

const CURA_USERNAME = process.env.CURA_USERNAME || user.username;
const CURA_PASSWORD = process.env.CURA_PASSWORD || user.password;

test.describe('Visual Regression: CURA', () => {
  test('@visual - landing page shell matches baseline', async ({ curaApp }) => {
    await curaApp.goto();

    await expect(curaApp.loginPage.getPage()).toHaveScreenshot('cura-landing-shell.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('@visual - appointment form matches baseline after login', async ({ curaApp }) => {
    await curaApp.login(CURA_USERNAME, CURA_PASSWORD);

    const appointmentSection = curaApp.appointmentPage.getPage().locator('#appointment');
    await expect(appointmentSection).toHaveScreenshot('cura-appointment-form.png', {
      animations: 'disabled',
    });
  });
});
