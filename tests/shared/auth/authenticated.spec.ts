import fs from 'fs';
import { Page } from '@playwright/test';
import { AppName } from '../../../src/config/app.config';
import { test, expect } from '../../../src/core/fixtures/auth.fixture';

const unsupportedApps = new Set<AppName>(['local']);

const assertAuthenticatedLanding = async (page: Page, appName: AppName): Promise<void> => {
  switch (appName) {
    case 'saucedemo':
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();
      break;
    case 'cura':
      await expect(page).toHaveURL(/#appointment|appointment\.php/i);
      await expect(page.getByRole('heading', { name: /make appointment/i })).toBeVisible();
      break;
    case 'vwo':
      await expect(page).not.toHaveURL(/#\/login/i);
      break;
    case 'orangehrm':
      await expect(page).toHaveURL(/\/dashboard\/index/i);
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      break;
    default:
      throw new Error(`No authenticated landing assertion registered for '${appName}'.`);
  }
};

const openProtectedRoute = async (page: Page, appName: AppName): Promise<void> => {
  switch (appName) {
    case 'saucedemo':
      await page.goto('/inventory.html');
      break;
    case 'cura':
      await page.goto('/profile.php#appointment');
      break;
    case 'vwo':
      await page.goto('/');
      break;
    case 'orangehrm':
      await page.goto('/web/index.php/dashboard/index');
      break;
    default:
      throw new Error(`No protected route registered for '${appName}'.`);
  }
};

test.describe('Authenticated session fixture', () => {
  test('creates or reuses storage state for supported apps', async ({
    appName,
    authSession,
    authenticatedPage,
  }) => {
    test.skip(
      unsupportedApps.has(appName),
      `Shared auth coverage is not implemented for ${appName}.`,
    );
    test.skip(
      !authSession.authenticated,
      `No authenticated session was available for ${appName}. Configure credentials to run this coverage.`,
    );

    expect(authSession.storageFile).toContain(`storage-state/${appName}.json`);
    expect(fs.existsSync(authSession.storageFile)).toBeTruthy();

    await assertAuthenticatedLanding(authenticatedPage, appName);
  });

  test('keeps protected routes accessible when the shared auth fixture is reused', async ({
    appName,
    authSession,
    authenticatedPage,
  }) => {
    test.skip(
      unsupportedApps.has(appName),
      `Shared auth coverage is not implemented for ${appName}.`,
    );
    test.skip(
      !authSession.authenticated,
      `No authenticated session was available for ${appName}. Configure credentials to run this coverage.`,
    );

    await openProtectedRoute(authenticatedPage, appName);
    await assertAuthenticatedLanding(authenticatedPage, appName);
  });
});
