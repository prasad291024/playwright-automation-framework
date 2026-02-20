/**
 * API Request and Response Type Definitions
 *
 * Centralized TypeScript types for API payloads and responses
 * Ensures type safety across the test suite
 */

/**
 * User entity
 */
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase?: string;
    bs?: string;
  };
  address?: {
    street: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
}

/**
 * Request payload for creating a new user
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  username: string;
  phone?: string;
  website?: string;
}

/**
 * API error response
 */
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>[];
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  timestamp: string;
}
