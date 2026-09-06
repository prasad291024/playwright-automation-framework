import { test } from '../../../src/core/fixtures/auth.fixture';
import { CuraAppointmentPage, CuraConfirmationPage } from '../../../src/pages/infrastructure';

// Example: Configure retry behavior for individual tests
// Uncomment to override the global or suite-level retry configuration:
// test.configure({ retries: 3 }); // Test-level retry override

test('user can book appointment', async ({ authenticatedPage, appName, authSession }) => {
  test.skip(appName !== 'cura', 'This regression test is scoped to the CURA app.');
  test.skip(
    !authSession.authenticated,
    'Shared auth fixture could not establish a CURA session for this run.',
  );

  const appointmentPage = new CuraAppointmentPage(authenticatedPage);
  await appointmentPage.verifyAppointmentPageVisible();
  await appointmentPage.bookAppointment();

  const confirmationPage = new CuraConfirmationPage(authenticatedPage);
  await confirmationPage.verifyAppointmentConfirmed();
});
