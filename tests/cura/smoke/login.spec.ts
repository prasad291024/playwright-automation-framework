import { test } from '@playwright/test';
import { LoginPage } from '../../../src/apps/cura/pages/LoginPage';
import { AppointmentPage } from '../../../src/apps/cura/pages/AppointmentPage';
import { user } from '../../../src/apps/cura/test-data/users';

test('user can login to CURA system', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate('https://katalon-demo-cura.herokuapp.com');

  await loginPage.login(user.username, user.password);

  const appointmentPage = new AppointmentPage(page);
  await appointmentPage.verifyAppointmentPageVisible();
});