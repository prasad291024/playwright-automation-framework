import { test, expect } from '@playwright/test';
import { SauceDemoLoginPage } from '../../../src/pages/infrastructure';

test('@smoke @saucedemo - login page shell renders correctly', async ({ page }) => {
  const loginPage = new SauceDemoLoginPage(page);
  await loginPage.goto();

  await expect(page).toHaveTitle(/swag labs/i);
  await expect(page.getByText(/accepted usernames are:/i)).toBeVisible();
});
