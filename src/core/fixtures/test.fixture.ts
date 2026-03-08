/**
 * Playwright Test Fixture
 * Provides custom fixtures for page objects and utilities
 */

import { test as base } from '@playwright/test';
import { logger } from '../utils/logger';
import { LoginPage as SauceDemoLoginPage } from '../../apps/saucedemo/pages/LoginPage';
import { InventoryPage } from '../../apps/saucedemo/pages/InventoryPage';
import { CartPage } from '../../apps/saucedemo/pages/CartPage';
import { LoginPage as CuraLoginPage } from '../../apps/cura/pages/LoginPage';
import { AppointmentPage } from '../../apps/cura/pages/AppointmentPage';
import { ConfirmationPage } from '../../apps/cura/pages/ConfirmationPage';

/**
 * Custom fixtures for all page objects
 */
interface PageObjects {
  // SauceDemo pages
  saucedemoLoginPage: SauceDemoLoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;

  // CURA pages
  curaLoginPage: CuraLoginPage;
  appointmentPage: AppointmentPage;
  confirmationPage: ConfirmationPage;

  // Utilities
  logger: typeof logger;
}

/**
 * Custom test fixture with page objects and utilities
 */
export const test = base.extend<PageObjects>({
  logger: async (use) => {
    logger.info('Test started');
    await use(logger);
    logger.info('Test completed');
  },

  // SauceDemo page fixtures
  saucedemoLoginPage: async ({ page }, use) => {
    const loginPage = new SauceDemoLoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  // CURA page fixtures
  curaLoginPage: async ({ page }, use) => {
    const loginPage = new CuraLoginPage(page);
    await use(loginPage);
  },

  appointmentPage: async ({ page }, use) => {
    const appointmentPage = new AppointmentPage(page);
    await use(appointmentPage);
  },

  confirmationPage: async ({ page }, use) => {
    const confirmationPage = new ConfirmationPage(page);
    await use(confirmationPage);
  },
});

export { expect } from '@playwright/test';
