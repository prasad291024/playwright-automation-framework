import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import app configuration
import { AppRegistry, AppConfig, AppName } from './src/config/app.config';

// Load app config mapping
const appsPath = path.resolve(__dirname, 'config', 'apps.json');
if (fs.existsSync(appsPath)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(appsPath, 'utf8')) as Record<string, AppConfig>;
    for (const [appName, config] of Object.entries(parsed)) {
      AppRegistry.register(appName as AppName, config);
    }
  } catch (e) {
    console.warn('Unable to parse config/apps.json, ignoring');
  }
}

const selectedApp = (process.env.APP || process.env.PLAYWRIGHT_APP || 'local') as AppName;
let appConfig: AppConfig;
try {
  appConfig = AppRegistry.get(selectedApp);
} catch (e) {
  console.warn(`App '${selectedApp}' not found in registry, falling back to local`);
  appConfig = AppRegistry.get('local');
}

// Propagate app-specific settings into environment
process.env.BASE_URL = appConfig.baseUrl;
process.env.STORAGE_STATE = appConfig.storageState || `storage-state/${selectedApp}.json`;
process.env.APP_NAME = selectedApp;

const resolvedStorageState = process.env.STORAGE_STATE;
const storageStateExists = resolvedStorageState ? fs.existsSync(resolvedStorageState) : false;

if (resolvedStorageState && !storageStateExists) {
  console.warn(
    `Storage state not found at ${resolvedStorageState}. Continuing without storage state.`,
  );
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Global test timeout - increased for flakiness resilience */
  timeout: process.env.CI ? 60_000 : 45_000, // 60s on CI, 45s locally
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only - helps with transient failures */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI for stability */
  workers: process.env.CI ? 1 : undefined,

  // Global setup script: runs once before all tests (e.g., login, session state)
  globalSetup: './globals/global-setup.ts',
  // Global teardown script: runs once after all tests (e.g., cleanup)
  globalTeardown: './globals/global-teardown.ts',

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['list'], ['json', { outputFile: 'test-results/results.json' }]],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: appConfig.baseUrl,
    actionTimeout: appConfig.timeouts.action,
    navigationTimeout: appConfig.timeouts.navigation,
    storageState: storageStateExists ? resolvedStorageState : undefined,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers and applications */
  projects: [
    // SauceDemo projects
    {
      name: 'saucedemo',
      testDir: './tests/saucedemo',
      use: { ...devices['Desktop Chrome'] },
    },

    // CURA projects
    {
      name: 'cura',
      testDir: './tests/cura',
      use: { ...devices['Desktop Chrome'] },
    },

    // Standard browser projects
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
