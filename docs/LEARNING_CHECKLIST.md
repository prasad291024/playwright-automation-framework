# 📚 Interactive Learning Checklist

This checklist helps you **track your learning progress** and **verify understanding** of each concept.

---

## Level 1: Foundations (Core Concepts)

### 1.1 Understanding Playwright

- [ ] I understand what Playwright is (browser automation tool)
- [ ] I know Playwright supports 3 browsers (Chromium, Firefox, WebKit)
- [ ] I understand the difference between headless and headed mode
- [ ] I know why Playwright is better than Selenium

**Test Your Understanding:**

- [ ] Can explain Playwright in 2 sentences?
- [ ] Can name 3 things Playwright can do?

**Resources:**

- Read [FRAMEWORK_COMPLETE_GUIDE.md](FRAMEWORK_COMPLETE_GUIDE.md#1.1-what-is-playwright)
- Quick Start: `npm test:headed` to see tests running

---

### 1.2 Understanding TypeScript

- [ ] I understand TypeScript adds type safety to JavaScript
- [ ] I know what a type annotation is
- [ ] I understand interfaces (contracts)
- [ ] I know why strict mode is helpful

**Test Your Understanding:**

- [ ] Can spot a type error in code?
- [ ] Can write a function with type annotations?

**Action Items:**

- [ ] Run `npm run typecheck` to see TypeScript in action
- [ ] Open any `.ts` file and hover over variables to see inferred types

---

### 1.3 Page Object Model (POM) Concept

- [ ] I understand what POM is (separates logic from selectors)
- [ ] I know why POM is better than hardcoding selectors
- [ ] I understand inheritance (class extends another)
- [ ] I understand interfaces define contracts

**Test Your Understanding:**

- [ ] Can explain POM in your own words?
- [ ] Can list 3 benefits of using POM?

**Hands-On:**

- [ ] Open [src/pages/LoginPage.ts](src/pages/LoginPage.ts)
- [ ] Open [src/interface/pages.interface.ts](src/interface/pages.interface.ts)
- [ ] Compare them - see how LoginPage implements ILoginPage

---

## Level 2: Project Structure

### 2.1 Folder Organization

- [ ] I understand each folder's purpose
- [ ] I know why selectors are centralized
- [ ] I understand the difference between src/ and tests/
- [ ] I know what test-data/ contains

**Test Your Understanding:**

- [ ] Which folder contains page objects?
- [ ] Which folder contains test files?
- [ ] Where are selectors defined?

**Hands-On:**

- [ ] Run `find . -name "*.ts" | head -20` in PowerShell
- [ ] List files in `src/pages` - count the page objects

---

### 2.2 Understanding BasePage

- [ ] I know BasePage is the foundation class
- [ ] I understand what methods BasePage provides
- [ ] I know what `abstract` means
- [ ] I understand protected methods vs public

**Test Your Understanding:**

- [ ] Can list 5 methods BasePage provides?
- [ ] Why is `goto()` abstract?

**Hands-On:**

- [ ] Open [src/pages/BasePage.ts](src/pages/BasePage.ts)
- [ ] Read and understand each method
- [ ] See how other pages extend BasePage

---

### 2.3 Selector Strategy

- [ ] I understand the 5-level selector priority
- [ ] I know why data-testid is preferred
- [ ] I understand getByRole and ARIA
- [ ] I know when to use CSS selectors (last resort)

**Test Your Understanding:**

- [ ] Rank these selectors from best to worst:
  - CSS class selector
  - getByRole
  - data-testid
  - XPath
  - getByPlaceholder

**Hands-On:**

- [ ] Open [src/utils/selectors.ts](src/utils/selectors.ts)
- [ ] See SELECTORS_BY_TESTID vs SELECTORS
- [ ] Understand the fallback strategy

---

## Level 3: Writing Tests

### 3.1 Simple UI Test

- [ ] I can read a `test()` function
- [ ] I understand Arrange-Act-Assert pattern
- [ ] I know what `async ({ page })` means
- [ ] I understand `await` for waiting

**Test Your Understanding:**

- [ ] Identify Arrange, Act, Assert in a test
- [ ] Explain why we need `await`

**Hands-On:**

- [ ] Open [tests/01-fundamentals/login.spec.ts](tests/01-fundamentals/login.spec.ts)
- [ ] Read test by test
- [ ] Trace the flow: test → LoginPage → BasePage → page

---

### 3.2 Data-Driven Tests

- [ ] I understand data-driven testing concept
- [ ] I know how to use a for loop with test data
- [ ] I understand why data should be external
- [ ] I can read JSON test data files

**Test Your Understanding:**

- [ ] Why use a for loop in tests?
- [ ] What's the benefit of external test data?

**Hands-On:**

- [ ] Open [test-data/fixtures/login.testUsers.json](test-data/fixtures/login.testUsers.json)
- [ ] Count test users
- [ ] Open the test that uses this data
- [ ] Trace how data flows into the test

---

### 3.3 Test Organization with describe()

- [ ] I understand `test.describe()` groups tests
- [ ] I know tests can be nested
- [ ] I understand test names should be descriptive
- [ ] I know proper test naming conventions

**Test Your Understanding:**

- [ ] What does `test.describe()` do?
- [ ] Can you write a good test name?

**Hands-On:**

- [ ] Search for `test.describe` in test files
- [ ] See how tests are grouped
- [ ] Check [tests/06-api-testing/user-api.spec.ts](tests/06-api-testing/user-api.spec.ts)

---

### 3.4 Assertions

- [ ] I know common assertions (toBeVisible, toHaveText, etc.)
- [ ] I understand `expect()` syntax
- [ ] I know difference between `toBe` vs `toContain`
- [ ] I understand negation with `not`

**Test Your Understanding:**

- [ ] What's difference between `.toHaveText('exact')` and `.toContainText('contains')`?
- [ ] How do you assert an element is NOT visible?

**Hands-On:**

- [ ] Open any test file
- [ ] Find all `expect()` assertions
- [ ] Comment on what each assertion checks

---

## Level 4: Page Objects Deep Dive

### 4.1 Creating a Page Object

- [ ] I understand page object structure (goto, actions, assertions)
- [ ] I know how to extend BasePage
- [ ] I know how to implement an interface
- [ ] I understand private vs protected vs public

**Test Your Understanding:**

- [ ] Create a simple page object structure on paper
- [ ] Name 3 methods a page object should have

**Hands-On:**

- [ ] Open [src/pages/LoginPage.ts](src/pages/LoginPage.ts)
- [ ] Open [src/pages/DashboardPage.ts](src/pages/DashboardPage.ts)
- [ ] Compare the structure
- [ ] Notice repeating patterns

---

### 4.2 Using Selectors in Page Objects

- [ ] I know how to use getByTestId()
- [ ] I know how to use getByRole()
- [ ] I know how to use getByPlaceholder()
- [ ] I understand fallback with `.or()`

**Test Your Understanding:**

- [ ] When would you use getByTestId vs getByRole?
- [ ] What does `.or()` do?

**Hands-On:**

- [ ] Find examples in LoginPage
- [ ] See how selectors import from utils/selectors.ts
- [ ] Trace: test → LoginPage method → getByTestId → BasePage method

---

### 4.3 Action Methods

- [ ] I understand action methods (what user does)
- [ ] I know to use async/await
- [ ] I understand wait strategies
- [ ] I know when to wait for navigation

**Test Your Understanding:**

- [ ] Name 5 user actions you can automate
- [ ] Why do we `await this.page.waitForLoadState()`?

**Hands-On:**

- [ ] Find all action methods in LoginPage
- [ ] See how they use getBy\* methods
- [ ] Check what they return (Promise<void> mostly)

---

### 4.4 Assertion Methods

- [ ] I understand assertion methods (verify results)
- [ ] I know to use `expect()`
- [ ] I understand multiple assertions in one method
- [ ] I know when to use `first()` for multiple matches

**Test Your Understanding:**

- [ ] How are assertion methods different from action methods?
- [ ] When would you use `.first()` in an assertion?

**Hands-On:**

- [ ] Find assertLoginSuccess() and assertLoginFailure()
- [ ] Understand the difference
- [ ] See `.or()` for fallback assertions

---

## Level 5: API Testing

### 5.1 API Concepts

- [ ] I understand what an API is (interface for backend)
- [ ] I know HTTP methods (GET, POST, PUT, DELETE)
- [ ] I understand request/response
- [ ] I know JSON format

**Test Your Understanding:**

- [ ] What's difference between GET and POST?
- [ ] What's a JSON object?

**Resources:**

- RESTful API basics: https://restfulapi.net/
- JSON format: https://www.json.org/

---

### 5.2 ApiHelper Class

- [ ] I understand ApiHelper is type-safe HTTP client
- [ ] I know it validates responses with schemas
- [ ] I understand generic types `<T>`
- [ ] I know how to use it in tests

**Test Your Understanding:**

- [ ] How do you use ApiHelper to get a user?
- [ ] What does `<User>` mean?

**Hands-On:**

- [ ] Open [src/utils/apiHelper.ts](src/utils/apiHelper.ts)
- [ ] Read the implementation
- [ ] See how it builds URL and makes requests

---

### 5.3 JSON Schema Validation

- [ ] I understand JSON schema defines valid structure
- [ ] I understand required fields
- [ ] I understand property types and formats
- [ ] I know AJV validates against schema

**Test Your Understanding:**

- [ ] What does "required" in schema mean?
- [ ] What does "format: email" check?

**Hands-On:**

- [ ] Open [schemas/user.schema.json](schemas/user.schema.json)
- [ ] Read each property
- [ ] Understand what makes a valid user

---

### 5.4 Writing API Tests

- [ ] I can write a GET test with validation
- [ ] I can write a POST test
- [ ] I understand schema validation in tests
- [ ] I know how to assert API responses

**Test Your Understanding:**

- [ ] Create a simple API test on paper
- [ ] Explain what schema validation does

**Hands-On:**

- [ ] Open [tests/06-api-testing/user-api.spec.ts](tests/06-api-testing/user-api.spec.ts)
- [ ] Read each test
- [ ] Understand the flow: get → validate → assert

---

## Level 6: Test Data & Configuration

### 6.1 Test Data Management

- [ ] I understand why external test data is good
- [ ] I can read JSON test data files
- [ ] I know how to use data in loops
- [ ] I understand environment-specific data

**Test Your Understanding:**

- [ ] Why not hardcode test data?
- [ ] How do you use multiple data sets?

**Hands-On:**

- [ ] Open [test-data/fixtures/](test-data/fixtures/)
- [ ] Look at different JSON files
- [ ] Understand structure of each

---

### 6.2 Playwright Configuration

- [ ] I understand base settings (testDir, timeout)
- [ ] I understand browser projects (chromium, firefox, webkit)
- [ ] I understand reporters (html, json, list)
- [ ] I understand retries and workers

**Test Your Understanding:**

- [ ] What do retries do?
- [ ] Why different worker count for CI vs local?

**Hands-On:**

- [ ] Open [playwright.config.ts](playwright.config.ts)
- [ ] Read line-by-line
- [ ] Understand each section

---

### 6.3 Global Setup & Teardown

- [ ] I understand global setup runs once before all tests
- [ ] I know it's used for login and initialization
- [ ] I understand global teardown runs once after
- [ ] I know it's used for cleanup

**Test Your Understanding:**

- [ ] What should global setup do?
- [ ] What should global teardown do?

**Hands-On:**

- [ ] Open [globals/global-setup.ts](globals/global-setup.ts)
- [ ] Open [globals/global-teardown.ts](globals/global-teardown.ts)
- [ ] Understand what they do

---

## Level 7: Running & Debugging

### 7.1 Running Tests Locally

- [ ] I can run `npm test` (all tests)
- [ ] I can run `npm test:headed` (visible browser)
- [ ] I can run specific tests with `-g` flag
- [ ] I understand how to run single file

**Test Your Understanding:**

- [ ] How do you run tests in a visible browser?
- [ ] How do you run only login tests?

**Hands-On:**

- [ ] Run `npm test -- -g "Login"` (specific tests)
- [ ] Run `npm test:headed -- tests/01-fundamentals/login.spec.ts` (specific file)
- [ ] See tests execute

---

### 7.2 Debugging Techniques

- [ ] I know `page.pause()` to stop and inspect
- [ ] I know `--debug` flag for interactive debug
- [ ] I understand screenshots for failures
- [ ] I understand tracing for replay

**Test Your Understanding:**

- [ ] How do you pause a test?
- [ ] When would you use debug mode?

**Hands-On:**

- [ ] Try `npm test:debug -- tests/01-fundamentals/login.spec.ts`
- [ ] Step through code using Inspector
- [ ] Try adding `page.pause()` to a test

---

### 7.3 Test Reports

- [ ] I know where HTML reports are generated
- [ ] I know how to open reports
- [ ] I understand test result information
- [ ] I know where to find screenshots

**Test Your Understanding:**

- [ ] Where are test reports saved?
- [ ] What information do reports show?

**Hands-On:**

- [ ] Run `npm test`
- [ ] Run `npx playwright show-report`
- [ ] Explore the HTML report
- [ ] See test duration, pass/fail, error messages

---

## Level 8: Best Practices

### 8.1 Resilient Selectors

- [ ] I prefer data-testid over CSS
- [ ] I prefer role-based selectors for accessibility
- [ ] I understand selector brittleness
- [ ] I avoid selectors that break on styling changes

**Test Your Understanding:**

- [ ] Which selector is most brittle?
- [ ] Why should I use getByRole?

**Hands-On:**

- [ ] Open a page object
- [ ] Check what selectors it uses
- [ ] Consider: could they break?

---

### 8.2 Meaningful Test Names

- [ ] I write test names that describe what's tested
- [ ] I include expected outcome in test name
- [ ] I avoid generic names like "test1"
- [ ] I use business language, not technical

**Test Your Understanding:**

- [ ] Good: "User can login with valid email and see dashboard"
- [ ] Bad: "login test"
- [ ] Can you write good test names?

**Hands-On:**

- [ ] Look at test names in your codebase
- [ ] Rate them: good or needs improvement?

---

### 8.3 Arrange-Act-Assert Pattern

- [ ] I structure every test with AAA
- [ ] I understand what each section does
- [ ] I keep tests focused (one thing)
- [ ] I use comments to mark sections

**Test Your Understanding:**

- [ ] Identify AAA in a test
- [ ] Why keep tests focused?

**Hands-On:**

- [ ] Take a test and label Arrange/Act/Assert
- [ ] Check if it follows the pattern

---

### 8.4 Async/Await Best Practices

- [ ] I always use `await` for async operations
- [ ] I never skip `await` (causes flakiness)
- [ ] I understand timing is critical
- [ ] I use proper wait strategies

**Test Your Understanding:**

- [ ] What happens if you forget `await`?
- [ ] Why is timing important in tests?

**Hands-On:**

- [ ] Open a test and find all `await` keywords
- [ ] Check: are there any forgotten awaits?

---

## Level 9: Advanced Topics

### 9.1 Typed API Responses

- [ ] I understand TypeScript interfaces for APIs
- [ ] I know generic types `<T>`
- [ ] I understand type safety benefits
- [ ] I can write API response interfaces

**Test Your Understanding:**

- [ ] Why use types for API responses?
- [ ] What does `<User>` mean?

**Hands-On:**

- [ ] Open [src/interface/api.interface.ts](src/interface/api.interface.ts)
- [ ] Understand User, CreateUserRequest interfaces
- [ ] See how ApiHelper uses them

---

### 9.2 Error Handling

- [ ] I understand testing error scenarios
- [ ] I test both success and failure paths
- [ ] I understand graceful degradation
- [ ] I use try-catch for unexpected errors

**Test Your Understanding:**

- [ ] How do you test login failure?
- [ ] When would you use try-catch?

**Hands-On:**

- [ ] Find a test for invalid login
- [ ] See how it asserts error message
- [ ] Compare with success test

---

### 9.3 Custom Assertions

- [ ] I know how to create assertion helpers
- [ ] I understand code reuse benefits
- [ ] I know to put assertions in utils/
- [ ] I keep assertions DRY

**Test Your Understanding:**

- [ ] Why create assertion helpers?
- [ ] What's DRY principle?

**Hands-On:**

- [ ] Open [src/utils/assertions.ts](src/utils/assertions.ts)
- [ ] See assertLoginSuccess and assertLoginFailure
- [ ] Find where they're used in tests

---

## Level 10: CI/CD & Automation

### 10.1 GitHub Actions

- [ ] I understand CI/CD concept
- [ ] I know tests run automatically on push
- [ ] I understand multi-browser testing in CI
- [ ] I know how to view CI results

**Test Your Understanding:**

- [ ] Why use CI/CD?
- [ ] What happens when you push code?

**Hands-On:**

- [ ] Check `.github/workflows/test.yml` file
- [ ] Understand the pipeline steps
- [ ] (If in GitHub) Check Actions tab for past runs

---

### 10.2 Code Quality Enforcement

- [ ] I understand ESLint (code style)
- [ ] I understand TypeScript strict (type safety)
- [ ] I understand Prettier (formatting)
- [ ] I know these run on every commit

**Test Your Understanding:**

- [ ] What does ESLint check?
- [ ] Why use strict TypeScript?

**Hands-On:**

- [ ] Run `npm run lint`
- [ ] Run `npm run typecheck`
- [ ] Run `npm run format`
- [ ] See what they do

---

## Final Verification ✅

### Can You Do This?

- [ ] Write a new page object from scratch
- [ ] Write a data-driven test using JSON data
- [ ] Write an API test with schema validation
- [ ] Run tests locally and view reports
- [ ] Debug a failing test
- [ ] Understand the error message
- [ ] Fix the issue
- [ ] Run tests again and verify they pass
- [ ] Explain the framework to someone else

### Framework Mastery Checklist

- [ ] **Core**: Playwright, TypeScript, POM, Interfaces
- [ ] **Structure**: Folders, BasePage, Pages
- [ ] **Selectors**: Strategy, resilience, centralization
- [ ] **Tests**: Simple, data-driven, organized
- [ ] **API**: ApiHelper, schema validation
- [ ] **Data**: External JSON, environment-specific
- [ ] **Config**: Playwright config, setup/teardown
- [ ] **Run**: Local, debug, reports
- [ ] **Best Practices**: Names, AAA, async/await
- [ ] **Advanced**: Types, errors, assertions
- [ ] **CI/CD**: Automation, code quality

---

## Next Steps

### Immediate (This Week)

1. [ ] Read [FRAMEWORK_COMPLETE_GUIDE.md](FRAMEWORK_COMPLETE_GUIDE.md) (all 10 parts)
2. [ ] Understand [ARCHITECTURE_VISUAL_GUIDE.md](ARCHITECTURE_VISUAL_GUIDE.md) (all diagrams)
3. [ ] Run tests: `npm test`
4. [ ] View report: `npx playwright show-report`
5. [ ] Run debug mode: `npm test:debug`

### Short-Term (This Month)

1. [ ] Create a new page object from scratch
2. [ ] Write a data-driven test
3. [ ] Write an API test
4. [ ] Add selectors to utils/selectors.ts
5. [ ] Create custom assertion helper
6. [ ] Add test data to test-data/fixtures/

### Long-Term (Ongoing)

1. [ ] Master all page objects in codebase
2. [ ] Become expert in debugging issues
3. [ ] Help others learn the framework
4. [ ] Improve test organization
5. [ ] Contribute best practices
6. [ ] Mentor new testers

---

## Resources

- **Main Guide**: [FRAMEWORK_COMPLETE_GUIDE.md](FRAMEWORK_COMPLETE_GUIDE.md)
- **Visual Diagrams**: [ARCHITECTURE_VISUAL_GUIDE.md](ARCHITECTURE_VISUAL_GUIDE.md)
- **This Checklist**: [LEARNING_CHECKLIST.md](LEARNING_CHECKLIST.md)
- **Test Examples**: [tests/](tests/)
- **Page Objects**: [src/pages/](src/pages/)
- **Official Docs**: https://playwright.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## Tips for Success

**✅ DO:**

- Read code more than you write code at first
- Try to understand existing patterns before changing them
- Ask "Why?" for every design decision
- Test your understanding by explaining it
- Start with simple tests, progress to complex
- Pair with experienced testers (if available)
- Review others' code (PR reviews)

**❌ DON'T:**

- Skip the learning guide
- Ignore error messages
- Hardcode selectors in tests
- Write tests without understanding the page
- Skip the AAA pattern
- Forget async/await
- Copy-paste without understanding
- Test multiple things in one test

---

Good luck on your learning journey! 🚀

Mark each item as you complete it. This checklist is YOUR learning roadmap!
