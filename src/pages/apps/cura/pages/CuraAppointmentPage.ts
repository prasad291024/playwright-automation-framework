import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

export class CuraAppointmentPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'cura' as AppName);
  }

  async goto(): Promise<void> {
    await this.navigateTo('/profile.php#appointment');
    await this.verifyAppointmentPageVisible();
  }

  async bookAppointment(): Promise<void> {
    await this.facilityDropdown().selectOption('Tokyo CURA Healthcare Center');
    await this.stableFill(this.visitDate(), '30/12/2023');
    await this.stableFill(this.comment(), 'Test appointment');
    await this.stableClick(this.bookAppointmentButton());
  }

  async verifyAppointmentPageVisible(): Promise<void> {
    await expect(this.facilityDropdown()).toBeVisible();
  }

  private facilityDropdown(): Locator {
    const selector = this.getAppSelector('appointment', 'facilityDropdown');
    return selector ? this.locator(selector) : this.page.locator('#combo_facility');
  }

  private visitDate(): Locator {
    const selector = this.getAppSelector('appointment', 'visitDate');
    return selector ? this.locator(selector) : this.page.locator('#txt_visit_date');
  }

  private comment(): Locator {
    const selector = this.getAppSelector('appointment', 'comment');
    return selector ? this.locator(selector) : this.page.locator('#txt_comment');
  }

  private bookAppointmentButton(): Locator {
    const selector = this.getAppSelector('appointment', 'bookAppointmentButton');
    return selector ? this.locator(selector) : this.page.locator('#btn-book-appointment');
  }
}
