import { test, expect } from '@playwright/test';

test('GET user profile from API', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data.name).toBe('Leanne Graham');
});

test('POST create new user', async ({ request }) => {
  const response = await request.post('https://jsonplaceholder.typicode.com/users', {
    data: {
      name: 'Prasad Tester',
      email: 'prasad@example.com',
      username: 'prasad123'
    }
  });

  expect(response.status()).toBe(201);
  const responseBody = await response.json();

  expect(responseBody.name).toBe('Prasad Tester');
  expect(responseBody.email).toBe('prasad@example.com');
});