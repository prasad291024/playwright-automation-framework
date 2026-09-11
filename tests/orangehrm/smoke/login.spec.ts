import { test } from '../../../src/core/fixtures/test.fixture';

const ORANGEHRM_USERNAME = process.env.ORANGEHRM_USERNAME || 'Admin';
const ORANGEHRM_PASSWORD = process.env.ORANGEHRM_PASSWORD || 'admin123';

test.describe('OrangeHRM Login', () => {
  test('@smoke @orangehrm - login succeeds with valid credentials', async ({ orangeHrmApp }) => {
    await orangeHrmApp.login(ORANGEHRM_USERNAME, ORANGEHRM_PASSWORD);
    await orangeHrmApp.loginPage.assertLoginSuccess();
  });
});
