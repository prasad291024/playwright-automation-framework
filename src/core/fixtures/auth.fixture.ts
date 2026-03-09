import { test as base, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { AppRegistry, AppName } from '../../config/app.config';
import { PageFactory } from '../../pages/infrastructure/PageFactory';

/**
 * Authentication Fixture
 *
 * Provides an authenticated BrowserContext and Page to tests that need it.
 * - If a storage state file exists, it loads from disk and reuses the session.
 * - If not, it can perform login flow using app-specific page objects.
 *
 * Usage:
 *   test('authenticated test', async ({ authenticatedPage, appName, pageFactory }) => {
 *     // page is pre-authenticated via storage state or login
 *     await authenticatedPage.goto('/dashboard');
 *   });
 */

interface AuthFixtures {
  authenticatedPage: Page;
  appName: AppName;
  pageFactory: typeof PageFactory;
}

export const test = base.extend<AuthFixtures>({
  appName: async (_deps, use) => {
    const name = (process.env.APP_NAME as AppName) || 'local';
    await use(name);
  },

  pageFactory: async (_deps, use) => {
    await use(PageFactory);
  },

  authenticatedPage: async ({ browser, appName }, use) => {
    const appConfig = AppRegistry.get(appName);
    const storageFile = path.resolve(process.cwd(), appConfig.storageState);

    // Create context with optional storage state
    const context = await browser!.newContext(
      fs.existsSync(storageFile) ? { storageState: storageFile } : {},
    );

    const page = await context.newPage();

    // If no storage state, perform login if auth is required
    if (!fs.existsSync(storageFile) && appConfig.authType !== 'none') {
      // TODO: Implement login flow using PageFactory
      // For now, just proceed - tests can handle login themselves
    }

    // Use the authenticated page in the test
    await use(page);

    // Cleanup
    await context.close();
  },
});

export { expect } from '@playwright/test';
