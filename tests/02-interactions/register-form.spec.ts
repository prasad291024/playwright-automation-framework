import { test, expect } from '@playwright/test';
import { RegisterPage } from '@pages/RegisterPage';

test('Fill out registration form using POM', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  await registerPage.goto();
  await registerPage.fillFirstName('Prasad');
  await registerPage.fillLastName('Tester');
  await registerPage.fillAddress('123 Automation Lane');
  await registerPage.fillEmail('prasad@example.com');
  await registerPage.fillPhone('9876543210');
  await registerPage.selectGender('Male');
  await registerPage.selectHobby('Cricket');
  await registerPage.selectSkill('Java');
  await registerPage.selectCountry('India');

  await expect(page.locator('input[placeholder="First Name"]')).toHaveValue('Prasad');
});
