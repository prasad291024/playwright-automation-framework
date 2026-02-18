# Test Fixtures & Test Data

Centralized location for all test fixtures and test data files (JSON, environment configs, etc.).

## Directory Structure

```
test-data/
├── fixtures/          # Shared JSON test data (users, forms, search queries, etc.)
├── api_requests/      # API payload templates for service testing
├── dev/               # Development environment test data (credentials, configs)
├── qa/                # QA environment test data
└── storage-state/     # Saved browser session states (cookies, localStorage, etc.)
```

## Usage

### Fixtures

Common test data used across multiple test suites:

```typescript
import testData from '../../test-data/fixtures/login.testUsers.json';
```

### Environment-Specific Data

Use `dev/` or `qa/` for environment-specific test data:

```json
// test-data/dev/login.json
{
  "username": "dev@example.com",
  "password": "devpass123"
}
```

### API Requests

Mock/template API call payloads:

```typescript
// test-data/api_requests/create-user.json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Storage State

Saved browser authentication states created during `global-setup.ts`:

```
test-data/storage-state/storageState.json  (auto-generated)
```

## Best Practices

1. **Single Source of Truth**: Keep test data in this folder only—avoid duplicating in tests/.
2. **Version Control**: Commit JSON fixtures but exclude `storage-state/*.json` from git.
3. **Organize by Type**: Group related data (logins, forms, API payloads) in logical files.
4. **README First**: Before creating a new data file, consider if it belongs in an existing category.
