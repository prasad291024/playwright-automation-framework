import { test as base, Page } from '@playwright/test';
import { AppName } from '../../config/app.config';
import {
  AuthSessionResult,
  createAuthenticatedSession,
  resolveAppNameFromEnv,
} from '../auth/auth-session';
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
  authSession: AuthSessionResult;
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

  authSession: async ({ browser, appName }, use) => {
    const authSession = await createAuthenticatedSession(browser, appName);
    await use(authSession);
    await authSession.context.close();
  },

  authenticatedPage: async ({ authSession }, use) => {
    const { page } = authSession;
    await use(page);
  },
});

export { expect } from '@playwright/test';
