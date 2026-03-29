import { test } from '@playwright/test';
import { CuraAppointmentPage, CuraLoginPage } from '../../../src/pages/infrastructure';
import { user } from '../../../src/apps/cura/test-data/users';

test('user can login to CURA system', async ({ page }) => {
  const loginPage = new CuraLoginPage(page);
  await loginPage.goto();
  await loginPage.goToLogin();

  await loginPage.login(user.username, user.password);

  const appointmentPage = new CuraAppointmentPage(page);
  await appointmentPage.verifyAppointmentPageVisible();
});
