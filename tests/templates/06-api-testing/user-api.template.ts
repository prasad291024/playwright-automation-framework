import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../src/utils/apiHelper';
import { schemaValidator } from '../../src/utils/schemaValidator';
import type { CreateUserRequest } from '../../src/interface/api.interface';

const BASE_API_URL = 'https://jsonplaceholder.typicode.com';

test.describe('User API Tests', () => {
  test('GET user by ID with schema validation', async ({ request }) => {
    const apiHelper = new ApiHelper(request, BASE_API_URL);

    // Fetch user and validate against schema
    const user = await apiHelper.getUser(1);

    // Assertions
    expect(user.id).toBe(1);
    expect(user.name).toBe('Leanne Graham');
    expect(user.email).toContain('@');
    expect(user.username).toBeTruthy();
  });

  test('GET multiple users and validate each', async ({ request }) => {
    const response = await request.get(`${BASE_API_URL}/users`);
    const users = await response.json();

    // Validate that response is an array
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);

    // Validate each user against schema
    for (const user of users.slice(0, 3)) {
      schemaValidator.validateOrThrow(user, 'user.schema.json');
    }
  });

  test('POST create new user with validation', async ({ request }) => {
    const apiHelper = new ApiHelper(request, BASE_API_URL);

    const newUser: CreateUserRequest = {
      name: 'Test User',
      email: 'testuser@example.com',
      username: 'testuser123',
    };

    // Create user and validate response
    const createdUser = await apiHelper.createUser(newUser);

    // Assertions
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.username).toBe(newUser.username);
    expect(createdUser.id).toBeDefined();
  });

  test('Validate error response schema on 404', async ({ request }) => {
    // Make request to non-existent endpoint
    const response = await request.get(`${BASE_API_URL}/users/99999`);

    // This mock API returns empty object on 404, but real APIs would return errors
    expect(response.status()).toBe(404);
  });

  test('Validate user email format in response', async ({ request }) => {
    const apiHelper = new ApiHelper(request, BASE_API_URL);
    const user = await apiHelper.getUser(1);

    // Email should be valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(user.email).toMatch(emailRegex);
  });

  test('Validate all user fields exist and have correct types', async ({ request }) => {
    const apiHelper = new ApiHelper(request, BASE_API_URL);
    const user = await apiHelper.getUser(1);

    // Type checking via assertions
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.username).toBe('string');

    // All required fields should exist
    expect(user.id).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.username).toBeDefined();
  });

  test('Test batch user creation with validation', async ({ request }) => {
    const apiHelper = new ApiHelper(request, BASE_API_URL);

    const testUsers: CreateUserRequest[] = [
      {
        name: 'Alice Test',
        email: 'alice@example.com',
        username: 'alicetest',
      },
      {
        name: 'Bob Test',
        email: 'bob@example.com',
        username: 'bobtest',
      },
      {
        name: 'Charlie Test',
        email: 'charlie@example.com',
        username: 'charlietest',
      },
    ];

    for (const testUser of testUsers) {
      const created = await apiHelper.createUser(testUser);
      expect(created.name).toBe(testUser.name);
      expect(created.email).toBe(testUser.email);
    }
  });
});
