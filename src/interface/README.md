# TypeScript Interfaces

Contains shared TypeScript interfaces and type definitions for the test framework.

## Purpose

Define contracts and types for:

- Page object models
- Test data structures
- API request/response types
- Custom fixtures and utilities

## Example

```typescript
export interface User {
  username: string;
  password: string;
  email?: string;
}
```

Add interface files here when they are shared across multiple modules.
