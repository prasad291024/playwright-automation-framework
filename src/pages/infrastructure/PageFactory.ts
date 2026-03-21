import { Page } from '@playwright/test';
import { AppName } from '../../config/app.config';

type PageObjectConstructor<T = unknown> = new (page: Page) => T;

/**
 * Page Factory
 * Dynamically creates app-specific page objects
 */
export class PageFactory {
  private static pageClasses: Map<string, PageObjectConstructor> = new Map();

  static register<T>(app: AppName, pageName: string, pageClass: PageObjectConstructor<T>): void {
    this.pageClasses.set(`${app}-${pageName}`, pageClass);
  }

  static create<T>(page: Page, app: AppName, pageName: string): T {
    const key = `${app}-${pageName}`;
    const PageClass = this.pageClasses.get(key);

    if (!PageClass) {
      throw new Error(`Page '${pageName}' not registered for app '${app}'`);
    }

    return new PageClass(page) as T;
  }

  static has(app: AppName, pageName: string): boolean {
    return this.pageClasses.has(`${app}-${pageName}`);
  }
}

// Register existing pages
import { VwoLoginPage } from '../apps/vwo';
import { CuraLoginPage } from '../apps/cura';
import { SauceDemoLoginPage } from '../apps/saucedemo';
import { OrangeHrmLoginPage } from '../apps/orangehrm';

PageFactory.register('vwo', 'LoginPage', VwoLoginPage);
PageFactory.register('cura', 'LoginPage', CuraLoginPage);
PageFactory.register('saucedemo', 'LoginPage', SauceDemoLoginPage);
PageFactory.register('orangehrm', 'LoginPage', OrangeHrmLoginPage);
