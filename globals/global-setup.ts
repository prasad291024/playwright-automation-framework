import { chromium } from '@playwright/test';
import fs from 'fs';
import {
  ensureStorageState,
  resolveAppNameFromEnv,
  resolveStorageFile,
} from '../src/core/auth/auth-session';

async function globalSetup() {
  const selectedApp = resolveAppNameFromEnv();
  const force = process.env.FORCE_AUTH_SETUP === '1';
  const storageFile = resolveStorageFile(selectedApp);

  // If storage state already exists, skip login flow
  if (!force && fs.existsSync(storageFile)) {
    console.log('Using existing storage state:', storageFile);
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const authenticated = await ensureStorageState(page, selectedApp, storageFile, force);
  if (!authenticated) {
    console.log(`Auth flow did not complete for APP=${selectedApp}; storage state not saved.`);
  }
  await browser.close();
}

export default globalSetup;
