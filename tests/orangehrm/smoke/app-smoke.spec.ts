import { test, expect } from '@playwright/test';
import { OrangeHrmLoginPage } from '../../../src/pages/infrastructure';

test('@smoke @orangehrm - login page shell renders correctly', async ({ page }) => {
  const loginPage = new OrangeHrmLoginPage(page);
  await loginPage.goto();

  await expect(page).toHaveTitle(/orangehrm/i);
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
});
