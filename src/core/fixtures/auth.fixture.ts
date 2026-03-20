import { test as base, Page } from '@playwright/test';
import { AppName } from '../../config/app.config';
import { createAuthenticatedSession, resolveAppNameFromEnv } from '../auth/auth-session';
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
  appName: async ({ browserName }, use) => {
    void browserName;
    await use(resolveAppNameFromEnv());
  },

  pageFactory: async ({ browserName }, use) => {
    void browserName;
    await use(PageFactory);
  },

  authenticatedPage: async ({ browser, appName }, use) => {
    const { context, page } = await createAuthenticatedSession(browser, appName);
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
