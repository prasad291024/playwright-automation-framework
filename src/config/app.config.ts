// src/config/app.config.ts
import { curaConfig } from './cura.config';
import { saucedemoConfig } from './saucedemo.config';
import { orangehrmConfig } from './orangehrm.config';

export interface AppConfig {
  name: string;
  baseUrl: string;
  storageState: string;
  authType: 'email' | 'username' | 'sso' | 'none';
  authEndpoint: string;
  timeouts: {
    page: number;
    action: number;
    navigation: number;
  };
  selectors: Record<string, Record<string, string>>;
  features: readonly string[];
  retryStrategy: 'standard' | 'exponential' | 'none';
  tags: readonly string[];
}

export type AppName = 'vwo' | 'cura' | 'saucedemo' | 'orangehrm' | 'local';

export class AppRegistry {
  private static configs: Map<AppName, AppConfig> = new Map();

  static register(app: AppName, config: AppConfig): void {
    this.configs.set(app, config);
  }

  static get(app: AppName): AppConfig {
    const config = this.configs.get(app);
    if (!config) throw new Error(`App not registered: ${app}`);
    return config;
  }

  static list(): AppName[] {
    return Array.from(this.configs.keys());
  }

  static has(app: AppName): boolean {
    return this.configs.has(app);
  }

  // Initialize and register all app configs
  static initialize(): void {
    this.register('cura', curaConfig);
    this.register('saucedemo', saucedemoConfig);
    this.register('orangehrm', orangehrmConfig);
    // Note: vwo and local are registered elsewhere or handled as fallbacks
  }
}

// Auto-initialize when module is imported
AppRegistry.initialize();
