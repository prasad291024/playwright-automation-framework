import { test } from '../../../src/core/fixtures/test.fixture';
import { user } from '../../../src/apps/cura/test-data/users';

test('@smoke @cura - user can login to CURA system', async ({ curaApp }) => {
  await curaApp.login(user.username, user.password);

  await curaApp.appointmentPage.verifyAppointmentPageVisible();
});
