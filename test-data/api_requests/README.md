# API Request Payloads

Template JSON payloads for API testing and mocking.

## Purpose

Store request/response body templates for:

- API endpoint tests
- Request validation
- Mock data generation

## Organization

Name files by endpoint or resource:

- `create-user.json`
- `update-profile.json`
- `login-request.json`

## Example

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "role": "user"
}
```

## Usage in Tests

```typescript
import createUserPayload from '../../test-data/api_requests/create-user.json';

const response = await apiContext.post('/users', {
  data: createUserPayload,
});
```
