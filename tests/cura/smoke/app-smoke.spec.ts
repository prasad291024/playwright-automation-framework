import { test, expect } from '../../../src/core/fixtures/test.fixture';

test('@smoke @cura - landing page shell renders correctly', async ({ curaApp }) => {
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
