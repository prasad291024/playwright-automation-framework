import { test, expect } from '../../../src/core/fixtures/auth.fixture';

/**
 * Shared Authentication Tests
 *
 * These tests validate that the authentication system works correctly
 * across all supported applications. They use the authenticated fixture
 * which provides a pre-authenticated page and app-specific facades.
 */
test.describe('@auth @shared - Authentication System', () => {
  test('should have valid authenticated session for SauceDemo', async ({
    authenticatedPage,
    appName,
    saucedemoApp,
  }) => {
    if (appName !== 'saucedemo') {
      test.skip();
      return;
    }

    // Verify we're on an authenticated page (should be inventory page after login)
    await authenticatedPage.waitForURL(/.*inventory.*/);

    // Verify we can access app-specific functionality
    // TypeScript: saucedemoApp is guaranteed to be defined when appName === 'saucedemo'
    await saucedemoApp!.inventoryPage.verifyInventoryLoaded();

    // Verify we can access the cart
    await saucedemoApp!.inventoryPage.addFirstProductToCart();
    await saucedemoApp!.cartPage.openCart();
    await saucedemoApp!.cartPage.verifyItemPresent();
  });

  test('should have valid authenticated session for CURA', async ({
    authenticatedPage,
    appName,
    curaApp,
  }) => {
    if (appName !== 'cura') {
      test.skip();
      return;
    }

    // Verify we're on an authenticated page (should be appointment page after login)
    await authenticatedPage.waitForURL(/.*appointment.*/);

    // Verify we can access app-specific functionality
    // TypeScript: curaApp is guaranteed to be defined when appName === 'cura'
    await curaApp!.appointmentPage.verifyAppointmentPageVisible();

    // Verify we can access confirmation functionality
    await curaApp!.appointmentPage.selectFacility('Hongkong CURA Healthcare Center');
    await curaApp!.appointmentPage.setVisitDate('01/01/2025');
    await curaApp!.appointmentPage.setComment('Test appointment via automated test');
    await curaApp!.appointmentPage.bookAppointment();
    await curaApp!.confirmationPage.verifyAppointmentConfirmed();
  });

  test('should have valid authenticated session for OrangeHRM', async ({
    authenticatedPage,
    appName,
    orangeHrmApp,
  }) => {
    if (appName !== 'orangehrm') {
      test.skip();
      return;
    }

    // Verify we're on an authenticated page (should be dashboard after login)
    await authenticatedPage.waitForURL(/.*dashboard.*/);

    // Verify we can access app-specific functionality
    // TypeScript: orangeHrmApp is guaranteed to be defined when appName === 'orangehrm'
    await orangeHrmApp!.dashboardPage.verifyDashboardVisible();

    // Verify we can access a protected menu item
    await orangeHrmApp!.dashboardPage.navigateToMenu('Admin');
    await orangeHrmApp!.dashboardPage.verifyMenuItemVisible('User Management');
  });

  test('should reuse storage state when valid', async ({ authSession }) => {
    // This test verifies that storage state reuse is working
    // The auth fixture automatically handles this, so we just verify the session is valid

    expect(authSession.authenticated).toBe(true);
    expect(authSession.storageFile).toBeTruthy();

    // Additional validation: storage state file should exist and be recent (< 12 hours old)
    const fs = await import('fs');
    const path = await import('path');
    const storagePath = path.resolve(authSession.storageFile);
    expect(fs.existsSync(storagePath)).toBe(true);

    // Check if file is less than 12 hours old
    const stats = fs.statSync(storagePath);
    const ageInHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
    expect(ageInHours).toBeLessThan(12); // Should be less than 12 hours old
  });

  test('should provide app facades for authenticated testing', async ({
    appName,
    saucedemoApp,
    curaApp,
    orangeHrmApp,
  }) => {
    // Verify that the correct app facade is defined based on appName
    // and others are undefined

    switch (appName) {
      case 'saucedemo':
        expect(saucedemoApp).toBeDefined();
        expect(curaApp).toBeUndefined();
        expect(orangeHrmApp).toBeUndefined();
        break;
      case 'cura':
        expect(saucedemoApp).toBeUndefined();
        expect(curaApp).toBeDefined();
        expect(orangeHrmApp).toBeUndefined();
        break;
      case 'orangehrm':
        expect(saucedemoApp).toBeUndefined();
        expect(curaApp).toBeUndefined();
        expect(orangeHrmApp).toBeDefined();
        break;
      default:
        expect(saucedemoApp).toBeUndefined();
        expect(curaApp).toBeUndefined();
        expect(orangeHrmApp).toBeUndefined();
    }
  });
});
