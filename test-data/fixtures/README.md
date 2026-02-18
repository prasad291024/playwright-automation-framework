# Test Data Fixtures

Shared JSON test data used across multiple test suites.

## Files

- **`example.json`** - Example test data for page title checks
- **`login.testUsers.json`** - Valid and invalid test user credentials
- **`login.env.json`** - Alternative login credentials (for env-based testing)
- **`search.json`** - Search query test data
- **`form.json`** - Form submission test data

## Adding New Fixtures

1. Add your JSON file to this directory
2. Import in your tests: `import data from '../../test-data/fixtures/yourfile.json';`
3. Avoid creating duplicates—check for existing similar data first

## Format

Keep test data well-structured:

```json
{
  "validUsers": [{ "username": "user1", "password": "pass1" }],
  "invalidUsers": [{ "username": "bad", "password": "wrong" }]
}
```
