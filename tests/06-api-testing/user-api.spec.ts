import { test, expect, APIRequestContext } from '@playwright/test';

test('GET user profile from API', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data.name).toBe('Leanne Graham');
});
