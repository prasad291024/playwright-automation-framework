import { chromium } from '@playwright/test';
import fs from 'fs';
import { AppRegistry } from '../src/config/app.config';
import {
  ensureStorageState,
  resolveAppNameFromEnv,
  resolveStorageFile,
} from '../src/core/auth/auth-session';

const isSkippableLocalLaunchError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return /spawn EPERM|EACCES|Access is denied/i.test(message);
};

async function globalSetup() {
  const selectedApp = resolveAppNameFromEnv();
  const force = process.env.FORCE_AUTH_SETUP === '1';
  const skipAuthSetup = process.env.SKIP_GLOBAL_AUTH_SETUP === '1';
  const appConfig = AppRegistry.get(selectedApp);
  const storageFile = resolveStorageFile(selectedApp);

  if (skipAuthSetup) {
    console.log(
      `Skipping global auth setup for APP=${selectedApp} because SKIP_GLOBAL_AUTH_SETUP=1.`,
    );
    return;
  }

  if (appConfig.authType === 'none') {
    console.log(
      `Skipping global auth setup for APP=${selectedApp}; no authentication is required.`,
    );
    return;
  }

  // If storage state already exists, skip login flow
  if (!force && fs.existsSync(storageFile)) {
    console.log('Using existing storage state:', storageFile);
    return;
  }

  let browser;

  try {
    browser = await chromium.launch();
  } catch (error) {
    if (!process.env.CI && isSkippableLocalLaunchError(error)) {
      console.warn(
        `Global auth setup could not launch Chromium locally for APP=${selectedApp}. Continuing without saved storage state.`,
      );
      return;
    }

    throw error;
  }

  const page = await browser.newPage();

  try {
    const authenticated = await ensureStorageState(page, selectedApp, storageFile, force);
    if (!authenticated) {
      console.log(`Auth flow did not complete for APP=${selectedApp}; storage state not saved.`);
    }
  } finally {
    await browser.close();
  }
}

export default globalSetup;
