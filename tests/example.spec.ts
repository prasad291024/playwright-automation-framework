import { test, expect } from '@playwright/test';
import testData from './testData/example.json';

// Data-driven title check
for (const pageData of testData.pages) {
  test(`Page title contains "${pageData.expectedTitle}"`, async ({ page }) => {
    await page.goto(pageData.url);
    await expect(page).toHaveTitle(new RegExp(pageData.expectedTitle, 'i'));
  });
}

// Static interaction test
test('Get started link navigates to Installation section', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
