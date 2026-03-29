import { test, expect } from '@playwright/test';

test('@smoke - shared API health check', async ({ request }) => {
  const base =
    process.env.BASE_API_URL || process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';
  const response = await request.get(`${base}/users/1`);
  expect(response.status()).toBeLessThan(500);
});
