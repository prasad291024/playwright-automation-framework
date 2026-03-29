/**
 * Playwright Test Fixture
 * Provides custom fixtures for page objects and utilities
 */

import { test as base } from '@playwright/test';
import { logger } from '../utils/logger';
import {
  CuraConfirmationPage,
  CuraAppointmentPage,
  CuraLoginPage,
  SauceDemoCartPage,
  SauceDemoInventoryPage,
  SauceDemoLoginPage,
} from '../../pages/infrastructure';

/**
 * Custom fixtures for all page objects
 */
interface PageObjects {
  // SauceDemo pages
  saucedemoLoginPage: SauceDemoLoginPage;
  inventoryPage: SauceDemoInventoryPage;
  cartPage: SauceDemoCartPage;

  // CURA pages
  curaLoginPage: CuraLoginPage;
  appointmentPage: CuraAppointmentPage;
  confirmationPage: CuraConfirmationPage;

  // Utilities
  logger: typeof logger;
}

/**
 * Custom test fixture with page objects and utilities
 */
export const test = base.extend<PageObjects>({
  logger: async (_deps, use) => {
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
    const inventoryPage = new SauceDemoInventoryPage(page);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new SauceDemoCartPage(page);
    await use(cartPage);
  },

  // CURA page fixtures
  curaLoginPage: async ({ page }, use) => {
    const loginPage = new CuraLoginPage(page);
    await use(loginPage);
  },

  appointmentPage: async ({ page }, use) => {
    const appointmentPage = new CuraAppointmentPage(page);
    await use(appointmentPage);
  },

  confirmationPage: async ({ page }, use) => {
    const confirmationPage = new CuraConfirmationPage(page);
    await use(confirmationPage);
  },
});

export { expect } from '@playwright/test';
