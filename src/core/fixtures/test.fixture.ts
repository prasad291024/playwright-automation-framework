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
import { CuraApp } from '../../apps/cura';
import { SauceDemoApp } from '../../apps/saucedemo';
import { OrangeHrmApp } from '../../apps/orangehrm';
import { OrangeHrmLoginPage } from '../../pages/apps/orangehrm/pages/OrangeHrmLoginPage';
import { OrangeHrmDashboardPage } from '../../pages/apps/orangehrm/pages/OrangeHrmDashboardPage';

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

  // OrangeHRM pages
  orangeHrmLoginPage: OrangeHrmLoginPage;
  orangeHrmDashboardPage: OrangeHrmDashboardPage;

  // App facades
  curaApp: CuraApp;
  saucedemoApp: SauceDemoApp;
  orangeHrmApp: OrangeHrmApp;

  // Utilities
  logger: typeof logger;
}

/**
 * Custom test fixture with page objects and utilities
 */
export const test = base.extend<PageObjects>({
  logger: async ({}, use) => {
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

  // OrangeHRM page fixtures
  orangeHrmLoginPage: async ({ page }, use) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await use(loginPage);
  },

  orangeHrmDashboardPage: async ({ page }, use) => {
    const dashboardPage = new OrangeHrmDashboardPage(page);
    await use(dashboardPage);
  },

  // App facades
  curaApp: async ({ page }, use) => {
    await use(new CuraApp(page));
  },

  saucedemoApp: async ({ page }, use) => {
    await use(new SauceDemoApp(page));
  },

  orangeHrmApp: async ({ page }, use) => {
    await use(new OrangeHrmApp(page));
  },
});

export { expect } from '@playwright/test';
