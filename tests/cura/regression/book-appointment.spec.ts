import { test } from '../../../src/core/fixtures/test.fixture';

// Example: Configure retry behavior for individual tests
// Uncomment to override the global or suite-level retry configuration:
// test.configure({ retries: 3 }); // Test-level retry override

test.use({ storageState: 'storage-state/cura.json' });

test.beforeEach(async ({ curaApp, page }) => {
  await curaApp.appointmentPage.goto();

  // If session expired and redirected to login, re-authenticate on demand
  if (page.url().includes('#login') || (await page.locator('#txt-username').isVisible())) {
    await curaApp.login();
    await curaApp.appointmentPage.goto();
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
