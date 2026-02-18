# DOM Selectors

Centralized storage for page selectors (CSS, XPath, etc.).

## Purpose

Keep selectors organized and reusable:

- By page or feature
- Separates UI locators from test logic
- Easier to maintain when UI changes

## Structure

Consider organizing by page:

- `login.selectors.ts`
- `dashboard.selectors.ts`
- `checkout.selectors.ts`

## Example

```typescript
// selectors/login.selectors.ts
export const LOGIN_SELECTORS = {
  usernameInput: '#username',
  passwordInput: '#password',
  submitButton: 'button[type="submit"]',
};
```

Prefer using `page.locator()` with data-testid or role selectors for better stability.
