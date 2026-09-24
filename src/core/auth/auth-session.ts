import { Browser, BrowserContext, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { AppName, AppRegistry } from '../../config/app.config';
import { PageFactory } from '../../pages/infrastructure/PageFactory';
import { CuraLoginPage, OrangeHrmLoginPage, SauceDemoLoginPage } from '../../pages/infrastructure';
import { isValidEmail } from '../../utils/vwoAuth';
import { retryWithBackoff } from '../../utils/flakeHelper';

export interface AuthSessionResult {
  context: BrowserContext;
  page: Page;
  storageFile: string;
  authenticated: boolean;
  reusedStorageState: boolean;
}

export interface StorageStateStatus {
  reusable: boolean;
  reason: 'missing' | 'invalid' | 'stale' | 'valid';
  ageMs?: number;
}

interface LoginCredentials {
  username?: string;
  email?: string;
  password?: string;
}

const DEFAULT_STORAGE_STATE_MAX_AGE_HOURS = 12;

const resolveStorageStateMaxAgeMs = (): number => {
  const configuredHours = Number(process.env.AUTH_STORAGE_STATE_MAX_AGE_HOURS);
  const hours =
    Number.isFinite(configuredHours) && configuredHours > 0
      ? configuredHours
      : DEFAULT_STORAGE_STATE_MAX_AGE_HOURS;

  return hours * 60 * 60 * 1000;
};

const toAppName = (value?: string): AppName => {
  const candidate = (value || '').trim() as AppName;
  return AppRegistry.has(candidate) ? candidate : 'local';
};

const ensureStorageDirectory = (storageFile: string): void => {
  fs.mkdirSync(path.dirname(storageFile), { recursive: true });
};

const resolveCredentials = (appName: AppName): LoginCredentials => {
  switch (appName) {
    case 'vwo':
      return {
        email: process.env.VWO_EMAIL || '',
        password: process.env.VWO_PASSWORD || '',
      };
    case 'cura':
      return {
        username: process.env.CURA_USERNAME || '',
        password: process.env.CURA_PASSWORD || '',
      };
    case 'saucedemo':
      return {
        username: process.env.SAUCEDEMO_USERNAME || '',
        password: process.env.SAUCEDEMO_PASSWORD || '',
      };
    case 'orangehrm':
      return {
        username: process.env.ORANGEHRM_USERNAME || '',
        password: process.env.ORANGEHRM_PASSWORD || '',
      };
    default:
      return {};
  }
};

export const resolveAppNameFromEnv = (): AppName => {
  return toAppName(process.env.APP_NAME || process.env.APP || process.env.PLAYWRIGHT_APP);
};

export const resolveStorageFile = (appName: AppName): string => {
  const configuredPath = process.env.STORAGE_STATE || AppRegistry.get(appName).storageState;
  return path.resolve(process.cwd(), configuredPath);
};

export const getStorageStateStatus = (
  storageFile: string,
  maxAgeMs = resolveStorageStateMaxAgeMs(),
): StorageStateStatus => {
  if (!fs.existsSync(storageFile)) {
    return { reusable: false, reason: 'missing' };
  }

  try {
    const contents = fs.readFileSync(storageFile, 'utf8');
    const parsed = JSON.parse(contents) as { cookies?: unknown[]; origins?: unknown[] };

    // Invalidate if schema structure is incorrect OR if the cookies array is empty
    if (
      !Array.isArray(parsed.cookies) ||
      !Array.isArray(parsed.origins) ||
      parsed.cookies.length === 0
    ) {
      return { reusable: false, reason: 'invalid' };
    }

    // Invalidate if any cookie has expired according to its expiration timestamp
    const nowSec = Date.now() / 1000;
    const hasExpiredCookie = (parsed.cookies as Array<{ expires?: number }>).some(
      (cookie) =>
        typeof cookie.expires === 'number' && cookie.expires > 0 && cookie.expires <= nowSec,
    );
    if (hasExpiredCookie) {
      return { reusable: false, reason: 'stale' };
    }
  } catch {
    return { reusable: false, reason: 'invalid' };
  }

  const ageMs = Date.now() - fs.statSync(storageFile).mtimeMs;
  if (ageMs > maxAgeMs) {
    return { reusable: false, reason: 'stale', ageMs };
  }

  return { reusable: true, reason: 'valid', ageMs };
};

export const loginForApp = async (page: Page, appName: AppName): Promise<boolean> => {
  const credentials = resolveCredentials(appName);

  switch (appName) {
    case 'vwo': {
      const email = credentials.email || '';
      const hasValidEmail = isValidEmail(email);

      console.log(
        hasValidEmail
          ? 'Skipping VWO auth: VWO is currently archived from active execution until organization-owned credentials are restored.'
          : 'Skipping VWO auth: VWO is archived from active execution and valid organization-owned credentials are unavailable.',
      );
      return false;
    }

    case 'cura': {
      const username = credentials.username || '';
      const password = credentials.password || '';

      if (!username || !password) {
        console.log('Skipping CURA auth: set CURA_USERNAME and CURA_PASSWORD credentials.');
        return false;
      }

      const loginPage = PageFactory.create<CuraLoginPage>(page, 'cura', 'LoginPage');
      await loginPage.goto();
      await loginPage.goToLogin();
      await loginPage.login(username, password);
      await loginPage.assertLoginSuccess();
      return true;
    }

    case 'saucedemo': {
      const username = credentials.username || '';
      const password = credentials.password || '';

      if (!username || !password) {
        console.log(
          'Skipping SauceDemo auth: set SAUCEDEMO_USERNAME and SAUCEDEMO_PASSWORD credentials.',
        );
        return false;
      }

      const loginPage = PageFactory.create<SauceDemoLoginPage>(page, 'saucedemo', 'LoginPage');
      await loginPage.goto();
      await loginPage.login(username, password);
      await loginPage.assertLoginSuccess();
      return true;
    }

    case 'orangehrm': {
      const username = credentials.username || '';
      const password = credentials.password || '';

      if (!username || !password) {
        console.log('Skipping OrangeHRM auth: set ORANGEHRM_USERNAME and ORANGEHRM_PASSWORD.');
        return false;
      }

      const loginPage = PageFactory.create<OrangeHrmLoginPage>(page, 'orangehrm', 'LoginPage');
      return await retryWithBackoff(
        async () => {
          await loginPage.goto();
          await loginPage.login(username, password);
          await loginPage.assertLoginSuccess();
          return true;
        },
        {
          maxAttempts: 2,
          delayMs: 1000,
          onAttempt: (attempt, error) => {
            console.warn(
              `OrangeHRM login attempt ${attempt} failed (${error.message}). Retrying fresh login...`,
            );
          },
        },
      );
    }

    default:
      console.log(`No login flow registered for app '${appName}'.`);
      return false;
  }
};

export const ensureStorageState = async (
  page: Page,
  appName: AppName,
  storageFile = resolveStorageFile(appName),
  force = false,
): Promise<boolean> => {
  const appConfig = AppRegistry.get(appName);

  if (appConfig.authType === 'none') {
    return false;
  }

  if (!force && getStorageStateStatus(storageFile).reusable) {
    return true;
  }

  const authenticated = await loginForApp(page, appName);

  if (authenticated) {
    ensureStorageDirectory(storageFile);
    await page.context().storageState({ path: storageFile });
  }

  return authenticated;
};

const resolveAuthenticatedRoute = (appName: AppName): string => {
  switch (appName) {
    case 'saucedemo':
      return '/inventory.html';
    case 'cura':
      return '/index.php#appointment';
    case 'orangehrm':
      return '/web/index.php/dashboard/index';
    default:
      return '/';
  }
};

const isSessionValid = async (page: Page, appName: AppName): Promise<boolean> => {
  try {
    switch (appName) {
      case 'saucedemo': {
        try {
          await page.waitForSelector('.inventory_list, [data-test="error"], #login-button', {
            timeout: 3000,
          });
        } catch {
          // ignore timeout
        }
        return (
          page.url().includes('inventory.html') &&
          (await page.locator('.inventory_list').count()) > 0
        );
      }
      case 'cura':
        return (await page.locator('#combo_facility').count()) > 0;
      case 'orangehrm':
        return page.url().includes('dashboard') && !page.url().includes('auth/login');
      default:
        return true;
    }
  } catch {
    return false;
  }
};

export const createAuthenticatedSession = async (
  browser: Browser,
  appName: AppName,
): Promise<AuthSessionResult> => {
  const appConfig = AppRegistry.get(appName);
  const storageFile = resolveStorageFile(appName);
  const storageStateStatus = getStorageStateStatus(storageFile);
  const reusedStorageState = storageStateStatus.reusable;
  const context = await browser.newContext({
    ...(reusedStorageState ? { storageState: storageFile } : {}),
    baseURL: appConfig.baseUrl,
  });
  const page = await context.newPage();

  let authenticated = reusedStorageState;
  if (reusedStorageState) {
    // When storage state is reused, navigate to the authenticated route
    // so tests don't start on about:blank or an unauthenticated root URL
    await page.goto(resolveAuthenticatedRoute(appName), {
      waitUntil: 'domcontentloaded',
      timeout: appConfig.timeouts.navigation,
    });
    const valid = await isSessionValid(page, appName);
    if (!valid) {
      console.log(`Saved session for ${appName} is expired on server. Performing fresh login...`);
      authenticated = await ensureStorageState(page, appName, storageFile, true);
    }
  }
  if (!reusedStorageState) {
    authenticated = await ensureStorageState(page, appName, storageFile, true);
  }

  return {
    context,
    page,
    storageFile,
    authenticated,
    reusedStorageState,
  };
};
