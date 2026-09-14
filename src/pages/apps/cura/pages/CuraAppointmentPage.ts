import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

export class CuraAppointmentPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'cura' as AppName);
  }

  async goto(): Promise<void> {
    await this.navigateTo('/index.php#appointment');
  }

  async selectFacility(facility: string): Promise<void> {
    await this.facilityDropdown().selectOption(facility);
  }

  async setVisitDate(date: string): Promise<void> {
    await this.visitDate().click();
    const day = date.split('/')[0].replace(/^0/, '');
    const dayCell = this.page
      .locator('.datepicker-days td.day:not(.old):not(.new)')
      .filter({ hasText: new RegExp(`^${day}$`) });
    if ((await dayCell.count()) > 0) {
      await dayCell.first().click();
    } else {
      await this.visitDate().fill(date);
    }
  }

  async setComment(comment: string): Promise<void> {
    await this.stableFill(this.comment(), comment);
  }

  async bookAppointment(): Promise<void> {
    await this.stableClick(this.bookAppointmentButton());
  }

  async verifyAppointmentPageVisible(): Promise<void> {
    if (
      !/#appointment|appointment\.php/.test(this.page.url()) ||
      (await this.page.locator('#combo_facility').count()) === 0
    ) {
      await this.goto();
    }
    await this.page.waitForURL(/.*appointment.*/, { timeout: 15000, waitUntil: 'commit' });
    await expect(this.facilityDropdown()).toBeVisible({ timeout: 15000 });
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
