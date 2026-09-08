# GitHub Copilot Instructions for playwright-automation-framework

This document provides instructions for GitHub Copilot to maintain code quality standards and prevent CI/CD failures in this project. Follow these instructions for all code generation and modifications.

## 1. Code Formatting Standards

### Prettier Formatting Rules

- Do not add trailing blank lines. Files must end with exactly one newline character.
- Use exactly one blank line to separate import statements from code, function definitions from each other, and comment blocks from code.
- Never generate consecutive blank lines within code.
- Keep lines under 120 characters where possible.

When generating code:

```typescript
import { defineConfig } from '@playwright/test';

// Comment block
const config = {
  // configuration
};

const functionOne = (): void => {
  // logic
};

const functionTwo = (): void => {
  // logic
};
```

## 2. TypeScript and ESLint Compliance

### General Rules

- Remove unused variables, imports, and function parameters.
- Provide explicit types for variables and function parameters when they are not inferred safely.
- Do not use `any`. Use proper types or generics instead.
- Handle errors from async operations and API calls appropriately with `try`/`catch` blocks or an equivalent deliberate error-handling strategy.

### Import Organization

Organize TypeScript imports in this order:

1. External dependencies
2. One blank line
3. Internal imports

```typescript
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { AppRegistry } from './src/config/app.config';
import { getStorageStateStatus } from './src/core/auth/auth-session';
```

## 3. Specific File Rules

### `playwright.config.ts`

- Do not add extra blank lines in comment blocks or between function definitions.
- Keep spacing consistent with Prettier.
- Keep related configuration grouped together.
- Provide fallback values for environment variables and explain non-obvious fallbacks with concise comments.

Use this structure for documented sections:

```typescript
/**
 * Description of what this section does
 */
const getWorkerCount = (): number | undefined => {
  // implementation
};
```

### All TypeScript Files

- End each file with exactly one newline (`\\n`) and no trailing blank lines.
- Use `//` for single-line comments and `/** */` for multi-line documentation.
- Use 2 spaces for indentation, as enforced by Prettier.

## 4. Before Submitting Code

Check the following before asking Copilot to generate code or code completion:

1. There are no double blank lines.
2. The file ends with exactly one newline.
3. All imports are used.
4. Variables and parameters have appropriate explicit types where inference is insufficient.
5. Async operations and API calls have deliberate error handling.

Run these commands locally before committing:

```bash
npm run format:check
npm run lint
npm run typecheck
```

To apply automatic fixes when appropriate:

```bash
npm run format
npm run lint:fix
```

## 5. Common Issues and Prevention

### Extra Blank Lines in Configuration Files

If ESLint reports a `prettier/prettier` error requesting a deleted newline, inspect the surrounding comment block or function boundary and leave exactly one blank line where a separator is needed.

### Unused Variables or Imports

Delete unused declarations. If a declaration must remain for an external process, document that reason with a concise comment.

### Missing Type Annotations

Add parameter and return types when TypeScript cannot infer them safely. Prefer interfaces, type aliases, and generics over `any`.

## 6. Workflow Integration

The CI lint job in `.github/workflows/ci.yml` runs:

- `npm run lint`
- `npm run format:check`

A failure blocks downstream typecheck and test jobs. Before pushing a branch, run the same checks locally and address their output.

For a formatting-only CI failure:

```bash
git pull origin main
npm run format
npm run format:check
npm run lint
git add .
git commit -m "chore: fix code formatting"
git push origin feature/your-branch
```

## 7. Key Takeaways

1. Use single blank lines and never add double blank lines.
2. Use precise types and never introduce implicit or explicit `any`.
3. Remove unused imports and variables.
4. Run formatting, lint, and typecheck verification before committing.
5. Add concise documentation for public functions and complex logic.

## 8. Documentation References

- [Prettier documentation](https://prettier.io/docs/)
- [ESLint documentation](https://eslint.org/docs/latest/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Playwright test configuration](https://playwright.dev/docs/test-configuration)
