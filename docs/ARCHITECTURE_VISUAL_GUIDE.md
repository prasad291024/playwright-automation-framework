# Framework Architecture - Visual Guide

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Execution (npm test)                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Global Setup (Runs ONCE Before All Tests)    │   │
│  │  - Create storage state (login session)              │   │
│  │  - Seed test data                                    │   │
│  │  - Initialize connections                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Test Suite 1: Login Tests                  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Test: "User can login with valid credentials" │  │   │
│  │  │  1. Create LoginPage object                   │  │   │
│  │  │  2. Call page.goto()                          │  │   │
│  │  │  3. Call page.login(user, pass)               │  │   │
│  │  │  4. Assert success                            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Test: "User sees error with bad credentials"  │  │   │
│  │  │  ...                                           │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Test Suite 2: API Tests                    │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Test: "GET user with schema validation"       │  │   │
│  │  │  1. Create ApiHelper                          │  │   │
│  │  │  2. Call request.get('/users/1')              │  │   │
│  │  │  3. Validate response against schema          │  │   │
│  │  │  4. Assert fields                             │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       Global Teardown (Runs ONCE After All Tests)    │   │
│  │  - Cleanup test data                                 │   │
│  │  - Close connections                                 │   │
│  │  - Generate reports                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
              ┌───────────────────────┐
              │   HTML Test Report    │
              │  JSON Test Results    │
              │  Screenshots/Videos   │
              └───────────────────────┘
```

---

## 📁 Code Flow Diagram

### UI Test Flow

```
test() in *.spec.ts
    ↓
imports LoginPage
    ↓
new LoginPage(page)
    ↓
extends BasePage  ← provides common methods
    ↓
implements ILoginPage  ← ensures required methods
    ↓
calls loginPage.login(user, pass)
    ↓
uses SELECTORS_BY_TESTID  ← from selectors.ts
    ↓
uses getByTestId()  ← from BasePage
    ↓
interacts with page
    ↓
uses assertions  ← from utils/assertions.ts
    ↓
test passes/fails
```

### API Test Flow

```
test() in user-api.spec.ts
    ↓
imports ApiHelper
    ↓
new ApiHelper(request, baseUrl)
    ↓
calls apiHelper.get('/users/1')
    ↓
makes HTTP request to API
    ↓
gets response.json()
    ↓
calls schemaValidator.validateOrThrow()
    ↓
loads schema from schemas/ directory
    ↓
validates response against schema
    ↓
returns typed data<User>
    ↓
assertions on the data
    ↓
test passes/fails
```

---

## 🔄 Page Object Lifecycle

```
Test Starts
    ↓
┌───────────────────────────────┐
│ new LoginPage(page)           │
│ - Constructor runs            │
│ - Set baseUrl                 │
│ - Store page reference        │
└───────────────────────────────┘
    ↓
┌───────────────────────────────┐
│ await loginPage.goto()        │
│ - Call navigateTo('/login')   │
│ - Wait for page load          │
└───────────────────────────────┘
    ↓
┌───────────────────────────────┐
│ await loginPage.login(...)    │
│ - fillUsername()              │
│ - fillPassword()              │
│ - clickLoginButton()          │
│ - Wait for navigation         │
└───────────────────────────────┘
    ↓
┌───────────────────────────────┐
│ await loginPage.assert...()   │
│ - Verify expected result     │
│ - Assertions (expect())       │
└───────────────────────────────┘
    ↓
Test Ends
```

---

## 🧩 Component Dependencies

```
┌─────────────────────────────────────────────┐
│    Test Files (*.spec.ts)                   │
│  - Import and use page objects              │
│  - Import and use helpers                   │
│  - Write assertions                         │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴────────┐
        ↓               ↓
   ┌────────────┐  ┌──────────────────┐
   │   Pages/   │  │  Utils/          │
   │ Page Objects├──┤ - apiHelper      │
   │            │  │ - schemaValidator│
   │ - Login    │  │ - selectors      │
   │ - Dashboard│  │ - assertions     │
   │ - Profile  │  │ - logger         │
   │ - Search   │  └──────────────────┘
   │            │
   │ (extend)   │
   │ BasePage   │
   └────┬───────┘
        │
   ┌────▼────────────┐
   │  Interfaces/    │
   │  - ILoginPage   │
   │  - IDashboard   │
   │  - API types    │
   └────┬────────────┘
        │
   ┌────▼──────────────┐
   │ Test Data/        │
   │ - JSON files      │
   │ - Schemas         │
   │ - Credentials     │
   └───────────────────┘
```

---

## 🎯 Test Execution Model

### Parallel Execution (Default)

```
playwright.config.ts: fullyParallel: true

Test 1: Login Valid              Test 2: Login Invalid
├─ Setup (50ms)                 ├─ Setup (50ms)
├─ Navigate (200ms)             ├─ Navigate (200ms)
├─ Fill Form (100ms)            ├─ Fill Form (100ms)
├─ Submit (50ms)                ├─ Submit (50ms)
├─ Wait (300ms)                 └─ Assert (100ms)
└─ Assert (100ms)               Total: ~500ms
Total: ~700ms
                                Test 3: Logout           Test 4: API Get User
Both run SIMULTANEOUSLY!        ├─ Setup (50ms)         ├─ Make Request (100ms)
                                ├─ Navigate (200ms)     ├─ Get Response (200ms)
                                ├─ Click Logout (50ms)  ├─ Validate Schema (50ms)
                                └─ Assert (100ms)       └─ Assert (50ms)
                                Total: ~400ms           Total: ~400ms

Total Time: ~700ms (not 2500ms if run sequentially!)
```

### Serial Execution (CI)

```
playwright.config.ts: workers: 1 (CI only)

Test 1
├─ Setup
├─ Navigate
├─ Actions
└─ Assert
    ↓
Test 2 (waits for Test 1)
├─ Setup
├─ Navigate
├─ Actions
└─ Assert
    ↓
Test 3 (waits for Test 2)
    ...

Takes longer but uses less resources (good for CI)
```

---

## 📊 Selector Resolution Order

### When You Write:

```typescript
await this.getByTestId('username-field').fill('john@example.com');
```

### Playwright Does:

```
Step 1: Search for [data-testid="username-field"]
        └─→ Found! ✅
        └─→ Use this element
        └─→ Fill with value

Step 2: (Would happen if Step 1 failed)
        └─→ Search for getByRole('textbox', { name: 'username' })
        └─→ Use this element

Step 3: (Would happen if Step 2 failed)
        └─→ Search for getByPlaceholder('Enter username')

Step 4: (Would happen if Step 3 failed)
        └─→ Search for getByText('username')

Step 5: (Would happen if Step 4 failed)
        └─→ Timeout after 30 seconds
        └─→ Test fails ❌
```

---

## 🔐 Authentication State Management

```
First Test Run:
┌─────────────────────────────────────┐
│ Global Setup                        │
│ 1. Launch browser                   │
│ 2. Navigate to login page           │
│ 3. Fill credentials                 │
│ 4. Submit login                     │
│ 5. Wait for navigation              │
│ 6. Save storage state               │
│    └─ Cookies, localStorage cached  │
└─────────────────────────────────────┘
            ↓
     storageState.json created
            ↓
┌─────────────────────────────────────┐
│ Each Test                           │
│ 1. Load from storageState.json      │
│ 2. Browser automatically logged in  │
│ 3. No need to login in each test    │
└─────────────────────────────────────┘
            ↓
         Tests run faster!
            ↓
┌─────────────────────────────────────┐
│ Global Teardown                     │
│ 1. Clean up                         │
│ 2. Close connections                │
│ 3. Generate reports                 │
└─────────────────────────────────────┘
```

---

## 🔄 API Schema Validation Flow

```
API Response from Server
        ↓
┌───────────────────────────────────────┐
│ GET /users/1                          │
│ Response: {                           │
│   "id": 1,                            │
│   "name": "John Doe",                 │
│   "email": "john@example.com",        │
│   "username": "johndoe"               │
│ }                                     │
└───────────────────────────────────────┘
        ↓
schemaValidator.validateOrThrow(data, 'user.schema.json')
        ↓
Load Schema from File
┌───────────────────────────────────────┐
│ schemas/user.schema.json              │
│ {                                     │
│   "required": ["id", "name",          │
│                "email", "username"],  │
│   "properties": {                     │
│     "id": { "type": "integer" },      │
│     "name": { "type": "string" },     │
│     "email": { "type": "string",      │
│                "format": "email" },   │
│     "username": { "type": "string" }  │
│   }                                   │
│ }                                     │
└───────────────────────────────────────┘
        ↓
AJV Validator Checks:
┌───────────────────────────────────────┐
│ 1. id is number? ✅ (1 is number)     │
│ 2. name exists? ✅                    │
│ 3. name is string? ✅                 │
│ 4. email is valid? ✅                 │
│ 5. username exists? ✅                │
│                                       │
│ All checks passed ✅                  │
└───────────────────────────────────────┘
        ↓
Return Validated Data
┌───────────────────────────────────────┐
│ data = {                              │
│   id: 1,                              │
│   name: 'John Doe',                   │
│   email: 'john@example.com',          │
│   username: 'johndoe'                 │
│ }                                     │
└───────────────────────────────────────┘
        ↓
Test's Assertions:
expect(data.id).toBe(1) ✅
expect(data.email).toMatch(emailRegex) ✅
```

---

## 📈 Test Data Flow

```
Test Data Management:

test-data/
├── fixtures/              (Used by tests)
│   ├── login.testUsers.json
│   ├── login.env.json
│   ├── form.json
│   └── search.json
│
├── dev/                   (Development environment)
│   ├── users.json
│   └── config.json
│
├── qa/                    (QA environment)
│   ├── users.json
│   └── config.json
│
├── prod/                  (Production environment)
│   └── (use with caution - readonly tests only)
│
└── storage-state/         (Authentication cache)
    └── storageState.json

Usage in Test:
┌────────────────────────────────────┐
│ import testUsers from               │
│   '../../test-data/fixtures/...json'│
│                                    │
│ for (const user of testUsers) {    │
│   test(`Login as ${user.username}` │
│   await loginPage.login(...)        │
│ }                                   │
└────────────────────────────────────┘
```

---

## ✅ Configuration Hierarchy

```
Environment Variables (.env file or system)
        ↓
playwright.config.ts
        ↓
        ├─ testDir: './tests'
        ├─ timeout: 30_000
        ├─ fullyParallel: true
        ├─ retries: process.env.CI ? 2 : 0
        ├─ workers: process.env.CI ? 1 : undefined
        ├─ globalSetup: './globals/global-setup.ts'
        ├─ globalTeardown: './globals/global-teardown.ts'
        ├─ reporters: [html, json, list]
        ├─ baseURL: process.env.BASE_URL
        ├─ actionTimeout: 5000
        ├─ screenshot: 'only-on-failure'
        ├─ video: 'retain-on-failure'
        ├─ trace: 'on-first-retry'
        └─ projects: [chromium, firefox, webkit]
                ↓
        Test Execution with Config
                ↓
        Test Results
                ↓
        Reports (HTML, JSON)
```

---

## 🚀 CI/CD Pipeline

```
Commit Code → GitHub
        ↓
.github/workflows/test.yml triggered
        ↓
Runner starts (Ubuntu/Windows/Mac)
        ↓
npm install dependencies
        ↓
npx playwright install browsers
        ↓
npm run lint (ESLint check)
        ↓
npm run typecheck (TypeScript check)
        ↓
npm test (Playwright tests)
        │
        ├─ Chromium browser
        ├─ Firefox browser
        └─ WebKit browser
        │
        └─ Tests run in parallel
                ↓
        All tests passed? ✅
        │
        ├─ Yes → Generate reports
        │         Artifacts uploaded
        │         PR shows ✅ passing
        │
        └─ No → PR shows ❌ failing
                Logs attached
                Video/Screenshots available
```

---

## 🎓 Learning Path Visualization

```
Start Here
    ↓
01. Fundamentals (What is Playwright/TypeScript)
    ↓
02. Project Structure (Understand folder organization)
    ↓
03. BasePage & Page Objects (Learn inheritance)
    ↓
04. Writing Simple UI Tests (Simple login test)
    ↓
05. Data-Driven Tests (Using JSON test data)
    ↓
06. Page Object Best Practices (Complex pages)
    ↓
07. Assertions & Error Handling (Verify results)
    ↓
08. Selectors Strategy (Resilient selectors)
    ↓
09. API Testing (Test backend directly)
    ↓
10. Schema Validation (Validate API responses)
    ↓
11. Test Organization (group tests logically)
    ↓
12. Debugging & Reporting (Find issues)
    ↓
13. Configuration (Setup environments)
    ↓
14. CI/CD Integration (Automate execution)
    ↓
✅ Framework Master!
```

---

## 💡 Key Concepts Summary

| Concept             | Purpose                      | Example                             |
| ------------------- | ---------------------------- | ----------------------------------- |
| **BasePage**        | Shared methods for all pages | Navigate, wait, click, fill         |
| **Page Object**     | Encapsulates single page     | LoginPage, DashboardPage            |
| **Interface**       | Type-safe contract           | ILoginPage defines required methods |
| **Selector**        | Find elements on page        | data-testid, getByRole, getByText   |
| **Assertion**       | Verify expected result       | expect(element).toBeVisible()       |
| **Data-Driven**     | Same test, multiple data     | for loop with test data             |
| **Schema**          | Validate API response        | JSON Schema with AJV                |
| **APiHelper**       | Type-safe HTTP client        | apiHelper.get<User>('/users/1')     |
| **Global Setup**    | Runs once before all tests   | Create auth state                   |
| **Global Teardown** | Runs once after all tests    | Clean up, generate reports          |
| **Storage State**   | Cached browser auth          | Reuse login across tests            |
| **Page Pause**      | Debug breakpoint             | page.pause() stops execution        |
| **Screenshots**     | Capture on failure           | Auto-saved for failed tests         |
| **Trace**           | Record execution             | Replay on failure                   |

---

This visual guide helps you understand **how everything connects** in your framework!
