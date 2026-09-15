import { test } from '../../../src/core/fixtures/auth.fixture';

test('@smoke @cura - user can login to CURA system', async ({
  authenticatedPage,
  appName,
  curaApp,
}) => {
  if (appName !== 'cura' || !curaApp) {
    test.skip();
    return;
  }

  // The authenticated fixture already logs us in, so we just verify we're on the right page
  await authenticatedPage.waitForURL(/.*appointment.*/);

  // Verify we can access app-specific functionality
  await curaApp.appointmentPage.verifyAppointmentPageVisible();
});
