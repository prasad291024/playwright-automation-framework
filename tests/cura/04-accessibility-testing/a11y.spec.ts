import { expect, test } from '../../../src/core/fixtures/test.fixture';

test.describe('Accessibility: CURA', () => {
  test('@a11y - homepage has a clear primary heading and CTA', async ({ curaApp }) => {
    await curaApp.goto();

    await expect(
      curaApp.loginPage
        .getPage()
        .getByRole('heading', { level: 1, name: /cura healthcare service/i }),
    ).toBeVisible();
    await expect(
      curaApp.loginPage.getPage().getByRole('link', { name: /make appointment/i }),
    ).toBeVisible();
  });

  test('@a11y - login form fields are keyboard reachable', async ({ curaApp }) => {
    await curaApp.goto();
    await curaApp.loginPage.goToLogin();
    await expect(curaApp.loginPage.getPage().locator('#txt-username')).toBeVisible();

    //await page.keyboard.press('Tab');
    await curaApp.loginPage.getPage().locator('#txt-username').focus();
    await expect(curaApp.loginPage.getPage().locator('#txt-username')).toBeFocused();

    await curaApp.loginPage.getPage().keyboard.press('Tab');
    await expect(curaApp.loginPage.getPage().locator('#txt-password')).toBeFocused();
  });
});
