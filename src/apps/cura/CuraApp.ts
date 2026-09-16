import { Page } from '@playwright/test';
import { CuraLoginPage } from '../../pages/apps/cura/pages/CuraLoginPage';
import { CuraAppointmentPage } from '../../pages/apps/cura/pages/CuraAppointmentPage';
import { CuraConfirmationPage } from '../../pages/apps/cura/pages/CuraConfirmationPage';

/** Demo credentials for the Katalon CURA Healthcare app. */
const CURA_DEFAULT_USERNAME = 'John Doe';
const CURA_DEFAULT_PASSWORD = 'ThisIsNotAPassword';

/**
 * Cura App Facade - Encapsulates all page objects and provides higher-level user flows.
 */
export class CuraApp {
  readonly loginPage: CuraLoginPage;
  readonly appointmentPage: CuraAppointmentPage;
  readonly confirmationPage: CuraConfirmationPage;

  constructor(private readonly page: Page) {
    this.loginPage = new CuraLoginPage(page);
    this.appointmentPage = new CuraAppointmentPage(page);
    this.confirmationPage = new CuraConfirmationPage(page);
  }

  async goto(): Promise<void> {
    await this.loginPage.goto();
  }

  /**
   * Login to the CURA application.
   *
   * When called with no arguments, credentials are resolved from environment variables
   * (`CURA_USERNAME` / `CURA_PASSWORD`) with fallback to the public demo credentials.
   *
   * @param username - Optional username override
   * @param password - Optional password override
   */
  async login(username?: string, password?: string): Promise<void> {
    const resolvedUsername =
      username ?? process.env.CURA_USERNAME ?? process.env.USERNAME ?? CURA_DEFAULT_USERNAME;
    const resolvedPassword =
      password ?? process.env.CURA_PASSWORD ?? process.env.PASSWORD ?? CURA_DEFAULT_PASSWORD;

    // Check if we are already logged in to avoid unnecessary login steps
    const currentUrl = this.page.url();
    const isLoggedIn =
      /#appointment|appointment\.php/i.test(currentUrl) &&
      (await this.page.locator('#combo_facility').count()) > 0;

    if (isLoggedIn) {
      return;
    }

    await this.loginPage.goto(); // Go to homepage

    // If session cookies authenticated us on the homepage, no need to log in again
    if ((await this.page.locator('#combo_facility, a[href*="logout"]').count()) > 0) {
      return;
    }

    await this.loginPage.goToLogin(); // Click "Make Appointment" and wait for login form
    await this.loginPage.login(resolvedUsername, resolvedPassword);
    await this.loginPage.assertLoginSuccess();
  }

  /**
   * Book an appointment with the given details.
   * @param facility - The facility to select
   * @param visitDate - The date of the visit (format: YYYY-MM-DD)
   * @param comment - Optional comment
   */
  async bookAppointment(facility: string, visitDate: string, comment?: string): Promise<void> {
    await this.appointmentPage.goto();
    await this.appointmentPage.selectFacility(facility);
    await this.appointmentPage.setVisitDate(visitDate);
    if (comment) {
      await this.appointmentPage.setComment(comment);
    }
    await this.appointmentPage.bookAppointment();
  }

  /**
   * Verify that the appointment confirmation is visible.
   */
  async assertConfirmationVisible(): Promise<void> {
    await this.confirmationPage.assertConfirmationVisible();
  }

  /**
   * Logout from the CURA application.
   * This will navigate to the login page.
   */
  async logout(): Promise<void> {
    // Try to click the logout link if visible
    const logoutLink = this.page.locator('a[href*="logout"], text=Logout');
    if (await logoutLink.isVisible()) {
      await logoutLink.click();
      // Wait for navigation to login page
      await this.page.waitForURL(/.*login.*/);
    } else {
      // If we can't find logout, just go to the login page directly
      await this.loginPage.goto();
      await this.loginPage.goToLogin();
    }
  }
}
