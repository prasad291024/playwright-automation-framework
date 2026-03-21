import { test } from '../../../src/core/fixtures/auth.fixture';
import { AppointmentPage } from '../../../src/apps/cura/pages/AppointmentPage';
import { ConfirmationPage } from '../../../src/apps/cura/pages/ConfirmationPage';

test('user can book appointment', async ({ authenticatedPage, appName, authSession }) => {
  test.skip(appName !== 'cura', 'This regression test is scoped to the CURA app.');
  test.skip(
    !authSession.authenticated,
    'Shared auth fixture could not establish a CURA session for this run.',
  );

  const appointmentPage = new AppointmentPage(authenticatedPage);
  await appointmentPage.verifyAppointmentPageVisible();
  await appointmentPage.bookAppointment();

  const confirmationPage = new ConfirmationPage(authenticatedPage);
  await confirmationPage.verifyAppointmentConfirmed();
});
