import { expect, test } from '@playwright/test';

const CURA_BASE_URL = process.env.CURA_BASE_URL || 'https://katalon-demo-cura.herokuapp.com';
const MAX_HOME_LOAD_MS = Number(process.env.CURA_MAX_HOME_LOAD_MS || 6000);
const MAX_LOGIN_LOAD_MS = Number(process.env.CURA_MAX_LOGIN_LOAD_MS || 7000);

test.describe('Performance: CURA', () => {
  test('@performance - homepage loads within threshold', async ({ page }) => {
    const start = Date.now();
    await page.goto(CURA_BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(MAX_HOME_LOAD_MS);
  });

  test('@performance - login page becomes interactive within threshold', async ({ page }) => {
    const start = Date.now();
    await page.goto(CURA_BASE_URL);
    await page.locator('#btn-make-appointment').click();
    await expect(page.locator('#txt-username')).toBeVisible();
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(MAX_LOGIN_LOAD_MS);
  });
});
