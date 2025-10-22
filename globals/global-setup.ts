import { chromium } from '@playwright/test';
import fs from 'fs';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL || 'https://your-app-url.com');

  // Example login flow
  await page.fill('#username', process.env.USERNAME || '');
  await page.fill('#password', process.env.PASSWORD || '');
  await page.click('button[type="submit"]');

  // Save session state
  await page.context().storageState({ path: 'storage-state/Storage-State.json' });
  await browser.close();
}

export default globalSetup;