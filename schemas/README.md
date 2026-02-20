# API Schemas

Centralized JSON Schema definitions for validating API requests and responses.

## Schema Files

### User Schema

- **File:** `user.schema.json`
- **Purpose:** Validates User entity responses from API
- **Used for:** GET /users/{id}, POST /users responses
- **Example:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe"
  }
  ```

### Create User Request Schema

- **File:** `createUser.request.schema.json`
- **Purpose:** Validates payloads when creating users
- **Requirements:** name, email, username (required), phone/website (optional)
- **Constraints:**
  - name: string (1-255 chars)
  - email: valid email format
  - username: 3-50 chars, alphanumeric + underscore/hyphen

### Error Response Schema

- **File:** `error.schema.json`
- **Purpose:** Validates error responses from API
- **Fields:**
  - statusCode (required): HTTP status code
  - message (required): Error description
  - error (optional): Error type
  - timestamp (optional): When error occurred
  - details (optional): Array of additional error info

## Usage

### Using Schema Validator

```typescript
import { schemaValidator } from '../../src/utils/schemaValidator';

const response = await request.get('/users/1');
const data = await response.json();

// Validate manually
const result = schemaValidator.validate(data, 'user.schema.json');
if (!result.isValid) {
  console.error('Validation failed:', result.errors);
}

// Or throw on invalid
schemaValidator.validateOrThrow(data, 'user.schema.json');
```

### Using API Helper (Recommended)

```typescript
import { ApiHelper } from '../../src/utils/apiHelper';

const apiHelper = new ApiHelper(request, 'https://api.example.com');

// Automatically validates against schema
const user = await apiHelper.getUser(1);
const created = await apiHelper.createUser({
  name: 'John',
  email: 'john@example.com',
  username: 'johndoe',
});
```

## Adding New Schemas

1. Create schema file in this directory with `.schema.json` extension
2. Follow JSON Schema draft-07 standard
3. Include `$schema` and `title` properties
4. Document required fields and constraints
5. Add README entry above

## JSON Schema Resources

- [JSON Schema Official Docs](https://json-schema.org/)
- [JSON Schema Validator](https://www.jsonschemavalidator.net/)
- [AJV Library](https://ajv.js.org/) (used in this project)

## Best Practices

1. **Be explicit:** Define all required fields
2. **Use formats:** email, uri, date-time for better validation
3. **Add constraints:** minLength, maxLength, pattern, enum where applicable
4. **Document:** Add descriptions to properties
5. **Test:** Validate your schemas with good and bad data
