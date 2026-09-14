import { test, expect } from '../../../src/core/fixtures/test.fixture';

test('@smoke @saucedemo - login page shell renders correctly', async ({ saucedemoApp }) => {
  await saucedemoApp.goto();

  await expect(saucedemoApp.loginPage.getPage()).toHaveTitle(/swag labs/i);
  await expect(
    saucedemoApp.loginPage.getPage().getByText(/accepted usernames are:/i),
  ).toBeVisible();
});
