import { expect, test } from '@playwright/test';

const CURA_BASE_URL = process.env.CURA_BASE_URL || 'https://katalon-demo-cura.herokuapp.com';

test.describe('Accessibility: CURA', () => {
  test('@a11y - homepage has a clear primary heading and CTA', async ({ page }) => {
    await page.goto(CURA_BASE_URL);

    await expect(
      page.getByRole('heading', { level: 1, name: /cura healthcare service/i }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /make appointment/i })).toBeVisible();
  });

  test('@a11y - login form fields are keyboard reachable', async ({ page }) => {
    await page.goto(CURA_BASE_URL);
    await page.locator('#btn-make-appointment').click();
    await expect(page.locator('#txt-username')).toBeVisible();

    await page.keyboard.press('Tab');
    await expect(page.locator('#txt-username')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#txt-password')).toBeFocused();
  });
});
