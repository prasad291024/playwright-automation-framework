module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'prettier', 'playwright'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:playwright/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'playwright/no-wait-for-timeout': 'warn',
    'playwright/no-focused-test': 'error',
    'playwright/no-skipped-test': 'warn',
    'playwright/missing-playwright-await': 'error',
    'playwright/no-force-option': 'warn',
    'playwright/no-networkidle': 'warn',
    'playwright/no-wait-for-navigation': 'warn',
    'playwright/prefer-web-first-assertions': 'warn',
    'playwright/valid-title': 'warn',
  },
};
