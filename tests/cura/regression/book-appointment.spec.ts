import { test } from '../../../src/core/fixtures/test.fixture';
import { getStorageStateStatus } from '../../../src/core/auth/auth-session';

// Example: Configure retry behavior for individual tests
// Uncomment to override the global or suite-level retry configuration:
// test.configure({ retries: 3 }); // Test-level retry override

test.use({ storageState: 'storage-state/cura.json' });

test.beforeEach(async ({ curaApp }) => {
  // Verify or perform authentication before accessing protected routes
  const status = getStorageStateStatus('storage-state/cura.json');
  if (!status.reusable) {
    // Either log in on demand:
    await curaApp.login();
  }
});

test('user can book appointment', async ({ curaApp }) => {
  // After login, verify we are on the appointment page before interacting.
  await curaApp.appointmentPage.verifyAppointmentPageVisible();

  await curaApp.appointmentPage.selectFacility('Hongkong CURA Healthcare Center');
  await curaApp.appointmentPage.setVisitDate('20/09/2026');
  await curaApp.appointmentPage.setComment('Comment');
  await curaApp.appointmentPage.bookAppointment();
  await curaApp.confirmationPage.verifyAppointmentConfirmed();
});
