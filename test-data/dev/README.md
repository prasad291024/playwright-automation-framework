# Dev Environment Test Data

Test data and credentials specific to the development environment.

## Purpose

Contain dev-specific:

- Test user credentials (dev accounts)
- API URLs and tokens
- Database test data
- Configuration overrides

## Files

- **`login.json`** - Dev environment login credentials (should not be committed if sensitive)

## Security Note

⚠️ **Do not commit actual credentials or secrets.**

- Use `.env` files for sensitive data
- Reference `process.env` in tests instead of hardcoding
- Keep this folder for non-sensitive test data only

## Structure

```json
{
  "username": "dev.user@example.com",
  "password": "${DEV_PASSWORD}", // Use env variable reference
  "baseUrl": "http://localhost:3000"
}
```
