import { Locator } from '@playwright/test';
import { BasePage } from '../../../core/base/BasePage';

export class AppointmentPage extends BasePage {
  private facilityDropdown: Locator;
  private visitDate: Locator;
  private comment: Locator;
  private bookAppointmentButton: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.facilityDropdown = this.page.locator('#combo_facility');
    this.visitDate = this.page.locator('#txt_visit_date');
    this.comment = this.page.locator('#txt_comment');
    this.bookAppointmentButton = this.page.locator('#btn-book-appointment');
  }

  async bookAppointment(): Promise<void> {
    await this.facilityDropdown.selectOption('Tokyo CURA Healthcare Center');
    await this.fill(this.visitDate, '30/12/2023');
    await this.fill(this.comment, 'Test appointment');
    await this.click(this.bookAppointmentButton);
  }

  async verifyAppointmentPageVisible(): Promise<void> {
    await this.assertVisible(this.facilityDropdown);
  }
}