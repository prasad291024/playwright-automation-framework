import fs from 'fs';
import { expect, test } from '@playwright/test';
import { getStorageStateStatus } from '../../../src/core/auth/auth-session';

const writeStorageState = (storageFile: string): void => {
  fs.writeFileSync(storageFile, JSON.stringify({ cookies: [], origins: [] }));
};

test.describe('Storage state validation', () => {
  test('accepts valid, recent Playwright storage state', async ({ browserName }, testInfo) => {
    void browserName;
    const storageFile = testInfo.outputPath('valid-storage-state.json');
    writeStorageState(storageFile);

    expect(getStorageStateStatus(storageFile, 1_000).reason).toBe('valid');
  });

  test('rejects malformed storage state', async ({ browserName }, testInfo) => {
    void browserName;
    const storageFile = testInfo.outputPath('invalid-storage-state.json');
    fs.writeFileSync(storageFile, '{not valid json');

    expect(getStorageStateStatus(storageFile).reason).toBe('invalid');
  });

  test('rejects expired storage state', async ({ browserName }, testInfo) => {
    void browserName;
    const storageFile = testInfo.outputPath('stale-storage-state.json');
    writeStorageState(storageFile);
    const staleDate = new Date(Date.now() - 2_000);
    fs.utimesSync(storageFile, staleDate, staleDate);

    expect(getStorageStateStatus(storageFile, 1_000).reason).toBe('stale');
  });
});
