import { test as base, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Authentication Fixture
 *
 * Provides an authenticated BrowserContext and Page to tests that need it.
 * - If a storage state file exists, it loads from disk and reuses the session.
 * - If not, it can be extended to perform login flow (see TODO in global-setup.ts).
 *
 * Usage:
 *   test('authenticated test', async ({ authenticatedPage }) => {
 *     // page is pre-authenticated via storage state
 *     await authenticatedPage.goto('/dashboard');
 *   });
 */

interface AuthFixtures {
  authenticatedPage: Page;
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const storageFile = path.resolve(
      process.cwd(),
      process.env.STORAGE_STATE || 'storage-state/storageState.json',
    );

    // Create context with optional storage state
    const context = await browser!.newContext(
      fs.existsSync(storageFile) ? { storageState: storageFile } : {},
    );

    const page = await context.newPage();

    // Use the authenticated page in the test
    await use(page);

    // Cleanup
    await context.close();
  },
});

export { expect } from '@playwright/test';
