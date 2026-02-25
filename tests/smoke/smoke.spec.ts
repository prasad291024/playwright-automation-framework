import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

// Smoke tests tagged with @smoke

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || '';

// Skip landing page assertion when BASE_URL is not configured or still a placeholder.
const skipLanding = !BASE || BASE.includes('your-app-url') || BASE.includes('your-app-url.com');

test.skip(skipLanding, 'Skipping landing title check because BASE_URL is not configured');

test('@smoke - Landing page has title', async ({ page }) => {
  // Helpful debug output when running locally
  console.log('BASE_URL=', BASE || '(not set)');
  await page.goto('/');
  const title = await page.title();
  expect(title).toBeTruthy();
});

// Skip login test when BASE_URL is not configured for the app or is a known external host
const skipLogin = !BASE || /google|bing|duckduckgo|your-app-url/i.test(BASE);
test.skip(
  skipLogin,
  `Skipping login smoke: BASE_URL not configured for app (BASE_URL=${BASE || 'unset'})`,
);

test('@smoke - Login and see dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  const base = process.env.BASE_URL || '';

  // Prefer checking an authenticated state (storageState). If already logged in, verify dashboard.
  await page.goto(`${base}/dashboard`);

  // If welcome header exists, we're already authenticated
  const welcomeVisible = await page.getByTestId('welcome-header').count();
  if (welcomeVisible > 0) {
    await dashboard.verifyWelcomeMessage();
    return;
  }

  // Otherwise perform login flow (fallbacks in LoginPage will try multiple locators)
  await loginPage.goto();
  const username = process.env.USERNAME || 'testuser';
  const password = process.env.PASSWORD || 'securepass123';

  await loginPage.login(username, password);
  await dashboard.verifyWelcomeMessage();
});

test('@smoke - API health check', async ({ request }) => {
  const base =
    process.env.BASE_API_URL || process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';
  const res = await request.get(`${base}/users/1`);
  expect(res.status()).toBeLessThan(500);
});
