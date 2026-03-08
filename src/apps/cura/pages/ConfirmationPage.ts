import { Locator } from '@playwright/test';
import { BasePage } from '../../../core/base/BasePage';

export class ConfirmationPage extends BasePage {
  private appointmentConfirmationSection: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.appointmentConfirmationSection = this.page.locator('#summary');
  }

  async verifyAppointmentConfirmed(): Promise<void> {
    await this.assertVisible(this.appointmentConfirmationSection);
  }
}