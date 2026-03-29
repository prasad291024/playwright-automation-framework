import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../../base/BasePage';
import { AppName } from '../../../../config/app.config';

export class CuraConfirmationPage extends BasePage {
  constructor(page: import('@playwright/test').Page) {
    super(page, 'cura' as AppName);
  }

  async goto(): Promise<void> {
    await this.navigateTo('/appointment.php#summary');
    await this.verifyAppointmentConfirmed();
  }

  async verifyAppointmentConfirmed(): Promise<void> {
    await expect(this.confirmationSection()).toBeVisible();
  }

  private confirmationSection(): Locator {
    const selector = this.getAppSelector('confirmation', 'confirmationSection');
    return selector ? this.locator(selector) : this.page.locator('#summary');
  }
}
