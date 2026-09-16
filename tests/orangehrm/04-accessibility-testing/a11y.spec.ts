import { expect, test } from '../../../src/core/fixtures/test.fixture';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Accessibility: OrangeHRM', () => {
  test('@a11y - login form controls are keyboard reachable', async ({ orangeHrmApp }) => {
    await orangeHrmApp.loginPage.goto();

    await orangeHrmApp.loginPage.getPage().locator('[name="username"]').focus();
    await expect(orangeHrmApp.loginPage.getPage().locator('[name="username"]')).toBeFocused();

    await orangeHrmApp.loginPage.getPage().keyboard.press('Tab');
    await expect(orangeHrmApp.loginPage.getPage().locator('[name="password"]')).toBeFocused();

    await orangeHrmApp.loginPage.getPage().keyboard.press('Tab');
    await expect(
      orangeHrmApp.loginPage.getPage().getByRole('button', { name: /login/i }),
    ).toBeFocused();
  });

  test('@a11y - dashboard has proper heading structure', () => {
    // Would require login sequence - testing concept only
    test.skip();
  });
});
