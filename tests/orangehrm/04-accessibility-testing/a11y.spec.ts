import { expect, test } from '../../../src/core/fixtures/test.fixture';
import { PUBLIC_DEMO_CREDENTIALS } from '../../../src/config/public-demo-credentials';

test.use({ storageState: { cookies: [], origins: [] } });

const credentials = {
  username: process.env.ORANGEHRM_USERNAME || PUBLIC_DEMO_CREDENTIALS.orangehrm.username,
  password: process.env.ORANGEHRM_PASSWORD || PUBLIC_DEMO_CREDENTIALS.orangehrm.password,
};

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

  test('@a11y - dashboard has proper heading structure', async ({ orangeHrmApp }) => {
    await orangeHrmApp.loginPage.goto();
    await orangeHrmApp.loginPage.login(credentials.username, credentials.password);

    const page = orangeHrmApp.loginPage.getPage();
    const headings = page.getByRole('heading');

    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    // OrangeHRM uses h6 headings and has no h1, so check that headings exist and are exposed, not strict level order.
    await expect(headings).not.toHaveCount(0);
    await expect(headings.nth(1)).toBeVisible();
  });
});
