/**
 * Environment Configuration
 * Manages environment-specific settings and variables
 */

export interface EnvConfig {
  baseUrl: string;
  headless: boolean;
  timeout: number;
  retries: number;
  workers: number;
  slowMo: number;
}

export const getEnvConfig = (): EnvConfig => {
  return {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    headless: process.env.HEADLESS !== 'false',
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    retries: parseInt(process.env.RETRIES || '2'),
    workers: parseInt(process.env.WORKERS || '4'),
    slowMo: parseInt(process.env.SLOW_MO || '0'),
  };
};
