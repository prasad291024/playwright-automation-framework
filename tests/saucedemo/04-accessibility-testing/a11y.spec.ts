import { expect, test } from '../../../src/core/fixtures/test.fixture';
import { users } from '../../../src/apps/saucedemo/test-data/users';

test.describe('Accessibility: SauceDemo', () => {
  test('@a11y - login form controls are keyboard reachable', async ({ saucedemoApp }) => {
    const page = saucedemoApp.loginPage.getPage();
    await saucedemoApp.loginPage.goto();

    await page.keyboard.press('Tab');
    await expect(page.locator('#user-name')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#password')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#login-button')).toBeFocused();
  });

  test('@a11y - inventory page exposes labeled product content', async ({ saucedemoApp }) => {
    await saucedemoApp.login(users.standard_user.username, users.standard_user.password);
    await saucedemoApp.loginPage.assertLoginSuccess();

    const page = saucedemoApp.loginPage.getPage();
    await expect(page.getByText('Products')).toBeVisible();

    const images = page.locator('.inventory_item img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(imageCount, 3); i++) {
      await expect(images.nth(i)).toHaveAttribute('alt', /.+/);
    }

    const buttons = page.locator('.inventory_item button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      await expect(buttons.nth(i)).toHaveText(/.+/);
    }
  });
});
