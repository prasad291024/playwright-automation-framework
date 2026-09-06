import { defineConfig, devices, ReporterDescription } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import app configuration
import { AppRegistry, AppConfig, AppName } from './src/config/app.config';
import { getStorageStateStatus } from './src/core/auth/auth-session';

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
const selectedSuite = process.env.TEST_SUITE || 'all';
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
const storageStateStatus = resolvedStorageState
  ? getStorageStateStatus(resolvedStorageState)
  : { reusable: false, reason: 'missing' as const };
const requiresAuthStorage = appConfig.authType !== 'none';
const htmlReportOutput =
  process.env.PLAYWRIGHT_HTML_REPORT || `playwright-report/${selectedApp}/${selectedSuite}`;
const jsonReportOutput =
  process.env.PLAYWRIGHT_JSON_OUTPUT_FILE ||
  `test-results/json/${selectedApp}-${selectedSuite}.json`;
const junitReportOutput =
  process.env.PLAYWRIGHT_JUNIT_OUTPUT_FILE ||
  `test-results/junit/${selectedApp}-${selectedSuite}.xml`;

const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { outputFolder: htmlReportOutput, open: 'never' }],
  ['json', { outputFile: jsonReportOutput }],
];

if (junitReportOutput) {
  reporters.push(['junit', { outputFile: junitReportOutput }]);
}

if (resolvedStorageState && requiresAuthStorage && !storageStateStatus.reusable) {
  console.warn(
    `Storage state is ${storageStateStatus.reason} at ${resolvedStorageState}. Continuing without storage state.`,
  );
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
/*
 * Enhanced worker and retry configuration with environment overrides and app-specific strategy
 * Precedence:
 *   1. Explicit override via environment variable PLAYWRIGHT_RETRIES
 *   2. CI environment: 2 retries (unless overridden by PLAYWRIGHT_RETRIES)
 *   3. Debug mode: 0 retries (unless overridden by PLAYWRIGHT_RETRIES)
 *   4. App-specific retryStrategy: maps 'none'→0, 'standard'→1, 'exponential'→2
 *   5. Fallback: 1 retry
 * Note: Test-level configuration (test.describe.configure or test.configure) can still override this global setting.
 */


const getWorkerCount = (): number | undefined => {
  // Explicit override via environment variable
  if (process.env.PLAYWRIGHT_WORKERS) {
    const workers = parseInt(process.env.PLAYWRIGHT_WORKERS, 10);
    return !isNaN(workers) && workers > 0 ? workers : undefined;
  }

  // CI-specific defaults
  if (process.env.CI) return 1; // Stable single worker in CI

  // Local development: leave one core free for system responsiveness
  const cpuCount = os.cpus().length;
  return Math.max(1, cpuCount - 1);
};

const getRetryCount = (): number => {
  // Explicit override via environment variable (highest priority)
  if (process.env.PLAYWRIGHT_RETRIES) {
    const retries = parseInt(process.env.PLAYWRIGHT_RETRIES, 10);
    return !isNaN(retries) && retries >= 0 ? retries : 0;
  }

  // In CI, we use a stable default of 2 retries unless overridden by env var
  if (process.env.CI) {
    return 2;
  }

  // In debug mode, disable retries for faster iteration
  if (process.env.PLAYWRIGHT_DEBUG) {
    return 0;
  }

  // Use app-specific retry strategy to determine base retry count
  const strategyToRetryMap: Record<AppConfig['retryStrategy'], number> = {
    none: 0,
    standard: 1,
    exponential: 2,
  };

  // Fallback to 1 retry if strategy is not recognized (should not happen with proper config)
  return strategyToRetryMap[appConfig.retryStrategy] ?? 1;
};
export default defineConfig({
  testDir: './tests',
  /* Global test timeout - increased for flakiness resilience */
  timeout: process.env.CI ? 60_000 : 45_000, // 60s on CI, 45s locally
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only - helps with transient failures */
  retries: getRetryCount(),
  /* Opt out of parallel tests on CI for stability */
  workers: getWorkerCount(),

  // Global setup script: runs once before all tests (e.g., login, session state)
  globalSetup: './globals/global-setup.ts',
  // Global teardown script: runs once after all tests (e.g., cleanup)
  globalTeardown: './globals/global-teardown.ts',

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporters,
  outputDir: `test-results/artifacts/${selectedApp}/${selectedSuite}`,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: appConfig.baseUrl,
    actionTimeout: appConfig.timeouts.action,
    navigationTimeout: appConfig.timeouts.navigation,
    storageState:
      requiresAuthStorage && storageStateStatus.reusable ? resolvedStorageState : undefined,
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
