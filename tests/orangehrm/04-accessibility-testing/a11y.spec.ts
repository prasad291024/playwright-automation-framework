import { expect, test } from '@playwright/test';
import { OrangeHrmLoginPage } from '../../../src/pages/infrastructure';

const ORANGEHRM_USERNAME = process.env.ORANGEHRM_USERNAME || 'Admin';
const ORANGEHRM_PASSWORD = process.env.ORANGEHRM_PASSWORD || 'admin123';

test.describe('Accessibility: OrangeHRM', () => {
  test('@a11y - login form controls are keyboard reachable', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await loginPage.goto();

    await page.keyboard.press('Tab');
    await expect(page.locator('[name="username"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[name="password"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /login/i })).toBeFocused();
  });

  test('@a11y - dashboard exposes primary navigation landmarks', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await loginPage.goto();
    await loginPage.login(ORANGEHRM_USERNAME, ORANGEHRM_PASSWORD);
    await loginPage.assertLoginSuccess();

    await expect(page.getByRole('navigation', { name: /sidepanel/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /topbar menu/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });
});
