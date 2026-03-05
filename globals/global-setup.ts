import { chromium, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { isValidEmail, resolveVwoLoginUrl } from '../src/utils/vwoAuth';

async function globalSetup() {
  const selectedApp = process.env.APP || process.env.PLAYWRIGHT_APP || 'local';
  const force = process.env.FORCE_AUTH_SETUP === '1';
  const storageDir = path.resolve(process.cwd(), 'storage-state');
  const storageFile = process.env.STORAGE_STATE || path.join(storageDir, `${selectedApp}.json`);

  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

  // If storage state already exists, skip login flow
  if (!force && fs.existsSync(storageFile)) {
    console.log('Using existing storage state:', storageFile);
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  let authenticated = false;
  if (selectedApp === 'cura') {
    authenticated = await loginCura(page);
  } else if (selectedApp === 'vwo') {
    authenticated = await loginVwo(page);
  } else {
    console.log(`No global auth flow configured for APP=${selectedApp}. Skipping storage state.`);
    await browser.close();
    return;
  }

  if (authenticated) {
    // Save storage state for reuse in tests
    await page.context().storageState({ path: storageFile });
  } else {
    console.log(`Auth flow did not complete for APP=${selectedApp}; storage state not saved.`);
  }
  await browser.close();
}

async function loginCura(page: Page): Promise<boolean> {
  const curaBase = process.env.CURA_BASE_URL || 'https://katalon-demo-cura.herokuapp.com';
  const username = process.env.CURA_USERNAME || '';
  const password = process.env.CURA_PASSWORD || '';

  if (!username || !password) {
    console.log('CURA credentials missing. Set CURA_USERNAME and CURA_PASSWORD.');
    return false;
  }

  await page.goto(curaBase);
  await page.locator('#btn-make-appointment').click();
  await page.locator('#txt-username').fill(username);
  await page.locator('#txt-password').fill(password);
  await page.locator('#btn-login').click();

  await expect(page).toHaveURL(/#appointment|appointment\.php/i);
  await expect(page.getByRole('heading', { name: /make appointment/i })).toBeVisible();
  return true;
}

async function loginVwo(page: Page): Promise<boolean> {
  const email = process.env.VWO_EMAIL || '';
  const password = process.env.VWO_PASSWORD || '';
  const hasEmail = isValidEmail(email);

  if (!email || !password || !hasEmail) {
    console.log('VWO credentials missing or invalid. Set VWO_EMAIL and VWO_PASSWORD.');
    return false;
  }

  const loginUrl = resolveVwoLoginUrl();
  await page.goto(loginUrl);

  await page
    .locator('input[placeholder*="email" i], input[name="email"], input[type="email"]')
    .first()
    .fill(email);
  await page
    .locator('input[placeholder*="password" i], input[name="password"], input[type="password"]')
    .first()
    .fill(password);

  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/#\/login/);
  return true;
}

export default globalSetup;
