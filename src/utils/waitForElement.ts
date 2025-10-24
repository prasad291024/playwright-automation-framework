import { Page } from '@playwright/test';

export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
  } catch (error) {
    throw new Error(`Element "${selector}" not found within ${timeout}ms`);
  }
}
