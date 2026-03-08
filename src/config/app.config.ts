// src/config/app.config.ts
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
  features: string[];
  retryStrategy: 'standard' | 'exponential' | 'none';
  tags: string[];
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
}
