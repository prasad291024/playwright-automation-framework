import { expect, test } from '../../../src/core/fixtures/test.fixture';

const ORANGEHRM_USERNAME = process.env.ORANGEHRM_USERNAME || 'Admin';
const ORANGEHRM_PASSWORD = process.env.ORANGEHRM_PASSWORD || 'admin123';

test.describe('Accessibility: OrangeHRM', () => {
  test('@a11y - login form controls are keyboard reachable', async ({ orangeHrmApp }) => {
    await orangeHrmApp.loginPage.goto();

    // Establish focus on the entry form field
    await orangeHrmApp.loginPage.getPage().locator('[name="username"]').focus();
    await expect(orangeHrmApp.loginPage.getPage().locator('[name="username"]')).toBeFocused();

    // Verify Tab key navigates to password
    await orangeHrmApp.loginPage.getPage().keyboard.press('Tab');
    await expect(orangeHrmApp.loginPage.getPage().locator('[name="password"]')).toBeFocused();

    // Verify Tab key navigates to the submit button
    await orangeHrmApp.loginPage.getPage().keyboard.press('Tab');
    await expect(
      orangeHrmApp.loginPage.getPage().getByRole('button', { name: /login/i }),
    ).toBeFocused();
  });

  test('@a11y - dashboard exposes primary navigation landmarks', async ({ orangeHrmApp }) => {
    await orangeHrmApp.login(ORANGEHRM_USERNAME, ORANGEHRM_PASSWORD);

    await expect(
      orangeHrmApp.dashboardPage.getPage().getByRole('navigation', { name: /sidepanel/i }),
    ).toBeVisible();
    await expect(
      orangeHrmApp.dashboardPage.getPage().getByRole('navigation', { name: /topbar menu/i }),
    ).toBeVisible();
    await expect(
      orangeHrmApp.dashboardPage.getPage().getByRole('heading', { name: /dashboard/i }),
    ).toBeVisible();
  });
});
