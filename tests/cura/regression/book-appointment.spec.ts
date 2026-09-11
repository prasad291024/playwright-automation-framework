import { test } from '../../../src/core/fixtures/test.fixture';

// Example: Configure retry behavior for individual tests
// Uncomment to override the global or suite-level retry configuration:
// test.configure({ retries: 3 }); // Test-level retry override

test('user can book appointment', async ({ curaApp }) => {
  test.skip(process.env.APP_NAME !== 'cura', 'This regression test is scoped to the CURA app.');
  test.skip(!curaApp, 'CURA app fixture not available for this test configuration.');

  await curaApp.appointmentPage.verifyAppointmentPageVisible();
  await curaApp.appointmentPage.bookAppointment();

  await curaApp.confirmationPage.verifyAppointmentConfirmed();
});
