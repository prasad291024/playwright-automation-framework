import { chromium } from '@playwright/test';
import fs from 'fs';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://your-app.com/login'); // ✅ Step 1
  await request.get('https://jsonplaceholder.typicode.com/users/1');
  await page.waitForSelector('#username', { state: 'visible' }); // ✅ Step 2

  await page.fill('#username', process.env.USERNAME || '');
  await page.fill('#password', process.env.PASSWORD || '');
  await page.click('button[type="submit"]');

  // Save storage state
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;
