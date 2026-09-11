import { expect, test } from '../../../src/core/fixtures/test.fixture';

const MAX_HOME_LOAD_MS = Number(process.env.CURA_MAX_HOME_LOAD_MS || 6000);
const MAX_LOGIN_LOAD_MS = Number(process.env.CURA_MAX_LOGIN_LOAD_MS || 7000);

test.describe('Performance: CURA', () => {
  test('@performance - homepage loads within threshold', async ({ curaApp }) => {
    const start = Date.now();
    await curaApp.goto();
    await curaApp.loginPage.getPage().waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(MAX_HOME_LOAD_MS);
  });

  test('@performance - login page becomes interactive within threshold', async ({ curaApp }) => {
    const start = Date.now();
    await curaApp.goto();
    await curaApp.loginPage.goToLogin();
    await expect(curaApp.loginPage.getPage().locator('#txt-username')).toBeVisible();
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(MAX_LOGIN_LOAD_MS);
  });
});
