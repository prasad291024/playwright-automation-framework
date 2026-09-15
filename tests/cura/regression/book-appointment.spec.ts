import { test } from '../../../src/core/fixtures/auth.fixture';

// Example: Configure retry behavior for individual tests
// Uncomment to override the global or suite-level retry configuration:
// test.configure({ retries: 3 }); // Test-level retry override

test('user can book appointment', async ({ curaApp, appName }) => {
  if (appName !== 'cura' || !curaApp) {
    test.skip();
    return;
  }

  // We're already authenticated and on appointment page due to auth fixture
  await curaApp!.appointmentPage.verifyAppointmentPageVisible();

  await curaApp!.appointmentPage.selectFacility('Hongkong CURA Healthcare Center');
  await curaApp!.appointmentPage.setVisitDate('20/09/2026');
  await curaApp!.appointmentPage.setComment('Comment');
  await curaApp!.appointmentPage.bookAppointment();
  await curaApp!.confirmationPage.verifyAppointmentConfirmed();
});
