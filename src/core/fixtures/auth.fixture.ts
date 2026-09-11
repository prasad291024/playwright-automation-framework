import { test as base, Page } from '@playwright/test';
import { AppName } from '../../config/app.config';
import {
  AuthSessionResult,
  createAuthenticatedSession,
  resolveAppNameFromEnv,
} from '../auth/auth-session';
import { PageFactory } from '../../pages/infrastructure/PageFactory';
import { CuraApp } from '../../apps/cura';
import { SauceDemoApp } from '../../apps/saucedemo';
import { OrangeHrmApp } from '../../apps/orangehrm';

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
  // App facades for easier access
  curaApp?: CuraApp;
  saucedemoApp?: SauceDemoApp;
  orangeHrmApp?: OrangeHrmApp;
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

  // Provide app facades based on appName
  curaApp: async ({ appName, page }, use) => {
    if (appName === 'cura') {
      await use(new CuraApp(page));
    } else {
      await use(undefined as unknown as CuraApp);
    }
  },

  saucedemoApp: async ({ appName, page }, use) => {
    if (appName === 'saucedemo') {
      await use(new SauceDemoApp(page));
    } else {
      await use(undefined as unknown as SauceDemoApp);
    }
  },

  orangeHrmApp: async ({ appName, page }, use) => {
    if (appName === 'orangehrm') {
      await use(new OrangeHrmApp(page));
    } else {
      await use(undefined as unknown as OrangeHrmApp);
    }
  },
});

export { expect } from '@playwright/test';
