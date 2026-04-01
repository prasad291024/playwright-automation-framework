import { Browser, BrowserContext, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { AppName, AppRegistry } from '../../config/app.config';
import { PageFactory } from '../../pages/infrastructure/PageFactory';
import { CuraLoginPage, OrangeHrmLoginPage, SauceDemoLoginPage } from '../../pages/infrastructure';
import { isValidEmail } from '../../utils/vwoAuth';

export interface AuthSessionResult {
  context: BrowserContext;
  page: Page;
  storageFile: string;
  authenticated: boolean;
  reusedStorageState: boolean;
}

interface LoginCredentials {
  username?: string;
  email?: string;
  password?: string;
}

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
        email: process.env.VWO_EMAIL || process.env.USERNAME || '',
        password: process.env.VWO_PASSWORD || process.env.PASSWORD || '',
      };
    case 'cura':
      return {
        username: process.env.CURA_USERNAME || process.env.USERNAME || '',
        password: process.env.CURA_PASSWORD || process.env.PASSWORD || '',
      };
    case 'saucedemo':
      return {
        username: process.env.SAUCEDEMO_USERNAME || process.env.USERNAME || 'standard_user',
        password: process.env.SAUCEDEMO_PASSWORD || process.env.PASSWORD || 'secret_sauce',
      };
    case 'orangehrm':
      return {
        username: process.env.ORANGEHRM_USERNAME || process.env.USERNAME || 'Admin',
        password: process.env.ORANGEHRM_PASSWORD || process.env.PASSWORD || 'admin123',
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
      await loginPage.goto();
      await loginPage.login(username, password);
      await loginPage.assertLoginSuccess();
      return true;
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

  if (!force && fs.existsSync(storageFile)) {
    return true;
  }

  const authenticated = await loginForApp(page, appName);

  if (authenticated) {
    ensureStorageDirectory(storageFile);
    await page.context().storageState({ path: storageFile });
  }

  return authenticated;
};

export const createAuthenticatedSession = async (
  browser: Browser,
  appName: AppName,
): Promise<AuthSessionResult> => {
  const storageFile = resolveStorageFile(appName);
  const reusedStorageState = fs.existsSync(storageFile);
  const context = await browser.newContext(reusedStorageState ? { storageState: storageFile } : {});
  const page = await context.newPage();

  let authenticated = reusedStorageState;
  if (!reusedStorageState) {
    authenticated = await ensureStorageState(page, appName, storageFile);
  }

  return {
    context,
    page,
    storageFile,
    authenticated,
    reusedStorageState,
  };
};
