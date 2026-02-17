import { chromium, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const baseUrl = process.env.BASE_URL || 'https://your-app-url.com';
  const storageDir = path.resolve(process.cwd(), 'storage-state');
  const storageFile = path.join(storageDir, 'storageState.json');

  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

  // If storage state already exists, skip login flow
  if (fs.existsSync(storageFile)) {
    console.log('Using existing storage state:', storageFile);
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Replace with the actual login/flow to create an authenticated state
  await page.goto(baseUrl);

  // TODO: perform login steps here using env credentials
  // e.g. await page.fill('#username', process.env.USERNAME || '');

  // Save storage state for reuse in tests
  await page.context().storageState({ path: storageFile });
  await browser.close();

  // Example API call (optional diagnostics)
  try {
    const apiContext = await request.newContext();
    const response = await apiContext.get('https://jsonplaceholder.typicode.com/users/1');
    const data = await response.json();
    console.log('API response:', data);
  } catch (err) {
    // non-fatal
  }
}

export default globalSetup;