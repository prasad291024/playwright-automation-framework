import { test, expect } from '../../../src/core/fixtures/test.fixture';

test('@smoke @orangehrm - login page shell renders correctly', async ({ orangeHrmApp }) => {
  await orangeHrmApp.goto();

  await expect(orangeHrmApp.loginPage.getPage()).toHaveTitle(/orangehrm/i);
  await expect(orangeHrmApp.loginPage.getPage().locator('[name="username"]')).toBeVisible();
});
