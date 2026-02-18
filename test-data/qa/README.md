# QA Environment Test Data

Test data and credentials specific to the QA environment.

## Purpose

Store QA-specific:

- Test user accounts
- QA API URLs and configuration
- Environment-specific test fixtures
- Shared QA test data

## Files

Add QA-specific data files as needed:

- `login.json` - QA test user credentials
- `test-data.json` - Shared QA test fixtures
- `api-config.json` - QA API endpoints and tokens

## Security Note

⚠️ **Keep sensitive data out of version control.**

Use environment variables via `.env`:

```typescript
const qaUsername = process.env.QA_USERNAME;
const qaPassword = process.env.QA_PASSWORD;
```

## Usage

```typescript
import qaUsers from '../../test-data/qa/login.json';
```
