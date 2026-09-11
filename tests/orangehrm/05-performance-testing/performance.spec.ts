import { expect, test } from '../../../src/core/fixtures/test.fixture';

const ORANGEHRM_USERNAME = process.env.ORANGEHRM_USERNAME || 'Admin';
const ORANGEHRM_PASSWORD = process.env.ORANGEHRM_PASSWORD || 'admin123';
const MAX_LOGIN_PAGE_LOAD_MS = Number(process.env.ORANGEHRM_MAX_LOGIN_PAGE_LOAD_MS || 6000);
const MAX_DASHBOARD_READY_MS = Number(process.env.ORANGEHRM_MAX_DASHBOARD_READY_MS || 12000);

test.describe('Performance: OrangeHRM', () => {
  test('@performance - login page becomes interactive within threshold', async ({
    orangeHrmApp,
  }) => {
    const start = Date.now();

    await orangeHrmApp.goto();

    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(MAX_LOGIN_PAGE_LOAD_MS);
  });

  test('@performance - dashboard is ready after login within threshold', async ({
    orangeHrmApp,
  }) => {
    const start = Date.now();

    await orangeHrmApp.login(ORANGEHRM_USERNAME, ORANGEHRM_PASSWORD);

    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(MAX_DASHBOARD_READY_MS);
  });
});
