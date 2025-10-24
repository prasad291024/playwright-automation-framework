import { Page, expect } from '@playwright/test';
import { SELECTORS } from './selectors';

export async function assertLoginSuccess(page: Page) {
  await expect(page.locator(SELECTORS.dashboard.welcomeHeader)).toBeVisible();
}

export async function assertLoginFailure(page: Page) {
  await expect(page.locator(SELECTORS.login.errorMessage)).toBeVisible();
}
