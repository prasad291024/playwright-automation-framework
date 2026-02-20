import { APIRequestContext } from '@playwright/test';
import { schemaValidator } from './schemaValidator';
import { User, CreateUserRequest, ErrorResponse } from '../interface/api.interface';

/**
 * API Helper Utility
 *
 * Provides typed, schema-validated API request methods
 * Makes it easy to test REST APIs with built-in validation
 *
 * Usage:
 *   const apiHelper = new ApiHelper(request, 'https://api.example.com');
 *   const user = await apiHelper.getUser<User>(1, 'user.schema.json');
 */
export class ApiHelper {
  private baseUrl: string;

  constructor(
    private request: APIRequestContext,
    baseUrl: string,
  ) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a GET request and validate response against schema
   * @param endpoint - API endpoint (relative to baseUrl)
   * @param schemaFile - Schema file to validate against (optional)
   * @returns Parsed and validated response
   */
  async get<T>(endpoint: string, schemaFile?: string): Promise<{ data: T; status: number }> {
    const url = this.buildUrl(endpoint);
    const response = await this.request.get(url);
    const data = await response.json();

    if (schemaFile) {
      schemaValidator.validateOrThrow(data, schemaFile);
    }

    return {
      data: data as T,
      status: response.status(),
    };
  }

  /**
   * Make a POST request with typed payload and validate response
   * @param endpoint - API endpoint
   * @param payload - Request payload
   * @param schemaFile - Schema file to validate response (optional)
   * @returns Parsed and validated response
   */
  async post<T>(
    endpoint: string,
    payload: unknown,
    schemaFile?: string,
  ): Promise<{ data: T; status: number }> {
    const url = this.buildUrl(endpoint);
    const response = await this.request.post(url, {
      data: payload,
    });

    const data = await response.json();

    if (schemaFile) {
      schemaValidator.validateOrThrow(data, schemaFile);
    }

    return {
      data: data as T,
      status: response.status(),
    };
  }

  /**
   * Make a PUT request with typed payload and validate response
   * @param endpoint - API endpoint
   * @param payload - Request payload
   * @param schemaFile - Schema file to validate response (optional)
   * @returns Parsed and validated response
   */
  async put<T>(
    endpoint: string,
    payload: unknown,
    schemaFile?: string,
  ): Promise<{ data: T; status: number }> {
    const url = this.buildUrl(endpoint);
    const response = await this.request.put(url, {
      data: payload,
    });

    const data = await response.json();

    if (schemaFile) {
      schemaValidator.validateOrThrow(data, schemaFile);
    }

    return {
      data: data as T,
      status: response.status(),
    };
  }

  /**
   * Make a PATCH request
   * @param endpoint - API endpoint
   * @param payload - Request payload
   * @param schemaFile - Schema file to validate response (optional)
   * @returns Parsed and validated response
   */
  async patch<T>(
    endpoint: string,
    payload: unknown,
    schemaFile?: string,
  ): Promise<{ data: T; status: number }> {
    const url = this.buildUrl(endpoint);
    const response = await this.request.patch(url, {
      data: payload,
    });

    const data = await response.json();

    if (schemaFile) {
      schemaValidator.validateOrThrow(data, schemaFile);
    }

    return {
      data: data as T,
      status: response.status(),
    };
  }

  /**
   * Make a DELETE request
   * @param endpoint - API endpoint
   * @returns Response status
   */
  async delete(endpoint: string): Promise<number> {
    const url = this.buildUrl(endpoint);
    const response = await this.request.delete(url);
    return response.status();
  }

  /**
   * Get a user by ID with schema validation
   * @param userId - User ID
   * @returns User object
   */
  async getUser(userId: number | string): Promise<User> {
    const { data } = await this.get<User>(`/users/${userId}`, 'user.schema.json');
    return data;
  }

  /**
   * Create a new user with schema validation
   * @param payload - Create user request payload
   * @returns Created user with ID
   */
  async createUser(payload: CreateUserRequest): Promise<User> {
    const { data } = await this.post<User>('/users', payload, 'user.schema.json');
    return data;
  }

  /**
   * Get response and validate it matches error schema
   * @param endpoint - API endpoint
   * @returns Error response
   */
  async getError(endpoint: string): Promise<ErrorResponse> {
    const url = this.buildUrl(endpoint);
    const response = await this.request.get(url);
    const data = await response.json();

    schemaValidator.validateOrThrow(data, 'error.schema.json');

    return data as ErrorResponse;
  }

  /**
   * Build full URL from endpoint
   * @param endpoint - Relative endpoint
   * @returns Full URL
   */
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }

    return `${this.baseUrl}${endpoint}`;
  }
}
