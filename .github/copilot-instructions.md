# GitHub Copilot Instructions for playwright-automation-framework

## Overview
This document provides instructions to GitHub Copilot to maintain code quality standards and prevent CI/CD failures in this project. These instructions should be followed for all code generation and modifications.

---

## 1. Code Formatting Standards

### Prettier Formatting Rules
- **No trailing blank lines**: Ensure files end with a single newline character, not multiple blank lines
- **Single blank line between sections**: Use exactly ONE blank line to separate:
  - Import statements from code
  - Function definitions from each other
  - Comment blocks from code
- **No double blank lines**: Never generate consecutive blank lines within the code
- **Line length**: Keep lines under 120 characters where possible

**When generating code:**
```typescript
// ✅ CORRECT: Single blank line between sections
import { defineConfig } from '@playwright/test';

// Comment block
const config = {
  // configuration
};

// ✅ CORRECT: Single blank line between functions
const functionOne = () => {
  // logic
};

const functionTwo = () => {
  // logic
};

// ❌ WRONG: Double blank lines
const functionOne = () => {
  // logic
};


const functionTwo = () => {
  // logic
};
```

---

## 2. TypeScript & ESLint Compliance

### General Rules
- **No unused variables**: Remove any variables, imports, or function parameters that are not used
- **Strict typing**: Always provide explicit types for variables and function parameters
- **No `any` type**: Use proper types or generics instead of `any`
- **Proper error handling**: Always wrap async operations and API calls in try-catch blocks

### Import Organization
```typescript
// ✅ CORRECT ORDER:
// 1. External dependencies
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 2. Blank line
// 3. Internal imports
import { AppRegistry } from './src/config/app.config';
import { getStorageStateStatus } from './src/core/auth/auth-session';
```

---

## 3. Specific File Rules

### playwright.config.ts
- **No extra blank lines** in comment blocks or between function definitions
- **Consistent spacing**: Use single blank lines between logical sections
- **Configuration structure**: Keep related configurations grouped together
- **Environment variables**: Always provide fallback values with clear comments

**Common pattern in this file:**
```typescript
/**
 * Description of what this section does
 */
// Single blank line below
const variableName = (): ReturnType => {
  // implementation
};
```

### All TypeScript Files
- **File ending**: Must end with a single newline (`\n`), not multiple blank lines
- **Comment formatting**: Use `//` for single-line comments, `/** */` for multi-line documentation
- **Consistent indentation**: Use 2 spaces (enforced by Prettier)

---

## 4. Before Submitting Code

### Manual Checklist
Before asking Copilot to generate or asking for code completion, ensure:

1. **No double blank lines anywhere in the file**
2. **File ends with exactly one newline** (no trailing blank lines)
3. **All imports are used** in the code
4. **All variables have explicit types**
5. **All async operations have error handling**

### Automated Verification
Run these commands locally before committing:

```bash
# Check formatting (will show errors without fixing)
npm run format:check

# Fix formatting automatically
npm run format

# Run ESLint to catch code quality issues
npm run lint

# Fix ESLint issues automatically (when possible)
npm run lint -- --fix
```

---

## 5. Common Issues & Prevention

### Issue: Extra Blank Lines in Config Files
**Symptom**: ESLint error `Delete ⏎ prettier/prettier` at specific line number
**Prevention**: 
- Review comment blocks above functions - ensure only ONE blank line follows them
- Check between function definitions - exactly ONE blank line should separate them

**Example from playwright.config.ts:**
```typescript
| 87| */
| 88| 
| 89| const getWorkerCount = (): number | undefined => {  // ✅ CORRECT - one blank line above
```

### Issue: Unused Variables or Imports
**Symptom**: ESLint error about unused variable
**Prevention**: 
- Delete the variable if not used
- Or add a comment explaining why it must be kept: `// Used by external process`

### Issue: Missing Type Annotations
**Symptom**: ESLint error about implicit `any` type
**Prevention**: 
- Always specify return types for functions
- Always specify parameter types
- Use proper interfaces for object structures

---

## 6. Copilot Usage Examples

### ✅ GOOD PROMPT
```
Generate a TypeScript function that validates config files. 
The function should:
- Accept a file path string
- Return a boolean indicating validity
- Handle file read errors gracefully with proper logging
- Include JSDoc documentation
- Follow Prettier formatting with single blank lines between sections
```

### ❌ BAD PROMPT
```
Write me a config validator function
```

### ✅ GOOD FOLLOW-UP
```
Add proper error handling to this function and ensure it follows 
the project's formatting standards (no double blank lines, single 
newline at EOF, all variables typed).
```

---

## 7. Workflow Integration

### CI/CD Pipeline Check Points
The GitHub Actions workflow runs these quality checks:

1. **Lint Job** (`.github/workflows/ci.yml` - line 70-74)
   - Runs: `npm run lint` (ESLint)
   - Runs: `npm run format:check` (Prettier check)
   - **Failure Impact**: Blocks all downstream jobs (typecheck, test)

### Quick Fix During Development
If CI fails on formatting:
```bash
# Pull the latest changes
git pull origin main

# Fix all formatting issues automatically
npm run format

# Verify fixes
npm run format:check
npm run lint

# Commit and push
git add .
git commit -m "chore: fix code formatting"
git push origin feature/your-branch
```

---

## 8. Key Takeaways for Code Generation

When working with Copilot in this project:

1. **Always think about blank lines** - Single between sections, never double
2. **Always add types** - No implicit `any` anywhere
3. **Always clean up** - Remove unused variables and imports
4. **Always verify** - Run `npm run format:check && npm run lint` before committing
5. **Always document** - Add JSDoc comments for public functions and complex logic

---

## 9. Documentation References

- Prettier Configuration: [prettier.io](https://prettier.io/docs/)
- ESLint: [eslint.org](https://eslint.org/)
- TypeScript: [typescriptlang.org](https://www.typescriptlang.org/)
- Playwright Configuration: [playwright.dev](https://playwright.dev/docs/test-configuration)

---

## 10. Questions for Copilot

Use these prompts to guide Copilot when generating code:

- "Generate this following the project's formatting standards (single blank lines, no trailing blank lines)"
- "Add proper TypeScript types to this function"
- "Ensure this follows ESLint and Prettier rules from this project"
- "Review this code and identify any unused variables or imports"
- "Fix formatting issues while preserving all functionality"
