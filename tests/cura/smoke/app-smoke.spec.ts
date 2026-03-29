import { test, expect } from '@playwright/test';
import { CuraLoginPage } from '../../../src/pages/infrastructure';

test('@smoke @cura - landing page shell renders correctly', async ({ page }) => {
  const loginPage = new CuraLoginPage(page);
  await loginPage.goto();

  await expect(page.getByRole('heading', { name: /cura healthcare service/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /make appointment/i })).toBeVisible();
});
