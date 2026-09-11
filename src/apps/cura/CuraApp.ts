import { Page } from '@playwright/test';
import { CuraLoginPage } from '../../pages/apps/cura/pages/CuraLoginPage';
import { CuraAppointmentPage } from '../../pages/apps/cura/pages/CuraAppointmentPage';
import { CuraConfirmationPage } from '../../pages/apps/cura/pages/CuraConfirmationPage';

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
   * @param username - The username to login with
   * @param password - The password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.goToLogin();
    await this.loginPage.login(username, password);
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
}
