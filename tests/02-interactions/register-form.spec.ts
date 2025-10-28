import { test, expect } from '@playwright/test';

test('Fill out registration form', async ({ page }) => {
  await page.goto('https://demo.automationtesting.in/Register.html');

  await page.fill('input[placeholder="First Name"]', 'Prasad');
  await page.fill('input[placeholder="Last Name"]', 'Tester');
  await page.fill('textarea[ng-model="Adress"]', '123 Automation Lane');
  await page.fill('input[type="email"]', 'prasad@example.com');
  await page.fill('input[type="tel"]', '9876543210');

  await page.check('input[value="Male"]');
  await page.check('input[value="Cricket"]');

  await page.selectOption('#Skills', 'Java');
  await page.selectOption('#countries', 'India');

  await expect(page.locator('input[placeholder="First Name"]')).toHaveValue('Prasad');
});