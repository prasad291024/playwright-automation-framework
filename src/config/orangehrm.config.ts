/**
 * OrangeHRM Application Configuration
 */

export const orangehrmConfig = {
  name: 'OrangeHRM',
  baseUrl: 'https://opensource-demo.orangehrmlive.com',
  storageState: 'storage-state/orangehrm.json',
  authType: 'username',
  authEndpoint: '/web/index.php/auth/login',
  timeouts: {
    page: 15000,
    action: 8000,
    navigation: 20000,
  },
  selectors: {
    login: {
      usernameInput: "[name='username']",
      passwordInput: "[name='password']",
      loginButton: "[type='submit']",
    },
  },
  features: ['auth', 'dashboard', 'hr'],
  retryStrategy: 'standard',
  tags: ['@orangehrm', '@hr'],
} as const;
