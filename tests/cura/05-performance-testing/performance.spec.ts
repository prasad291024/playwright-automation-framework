import { test, expect } from '../../../src/core/fixtures/auth.fixture';

test.describe('Performance: CURA', () => {
  test('landing page load performance @cura @performance', async ({
    authenticatedPage,
    appName,
  }) => {
    if (appName !== 'cura') {
      test.skip();
      return;
    }

    // We're already authenticated, just navigate to the landing page
    await authenticatedPage.waitForURL(/.*\/#\/login/);

    // Measure time to load landing page
    const startTime = Date.now();
    await authenticatedPage.waitForLoadState('networkidle');
    const endTime = Date.now();

    const loadTime = endTime - startTime;
    console.log(`Landing page load time: ${loadTime}ms`);

    // Assert that load time is reasonable (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);
  });

  test('form interaction performance @cura @performance', async ({
    authenticatedPage,
    appName,
    curaApp,
  }) => {
    if (appName !== 'cura' || !curaApp) {
      test.skip();
      return;
    }

    // We're already authenticated, navigate to appointment page
    await authenticatedPage.waitForURL(/.*appointment.*/);

    // Measure time to fill out appointment form
    const startTime = Date.now();
    await curaApp.appointmentPage.selectFacility('Hongkong CURA Healthcare Center');
    await curaApp.appointmentPage.setVisitDate('20/09/2026');
    await curaApp.appointmentPage.setComment('Performance test comment');
    const endTime = Date.now();

    const formTime = endTime - startTime;
    console.log(`Form interaction time: ${formTime}ms`);

    // Assert that form interaction time is reasonable (under 2 seconds)
    expect(formTime).toBeLessThan(2000);
  });
});
