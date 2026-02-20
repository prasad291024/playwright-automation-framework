/**
 * Page Object Model Interfaces
 *
 * Defines contracts for all page objects to ensure consistency and type safety.
 */

/**
 * Base page interface - all page objects should extend this
 */
export interface IBasePage {
  goto(): Promise<void>;
}

/**
 * Login page interface
 */
export interface ILoginPage extends IBasePage {
  login(username: string, password: string): Promise<void>;
  assertLoginSuccess(): Promise<void>;
  assertLoginFailure(): Promise<void>;
  fillUsername(username: string): Promise<void>;
  fillPassword(password: string): Promise<void>;
  clickLoginButton(): Promise<void>;
}

/**
 * Dashboard page interface
 */
export interface IDashboardPage extends IBasePage {
  verifyWelcomeMessage(): Promise<void>;
  navigateToProfile(): Promise<void>;
  navigateToSettings(): Promise<void>;
}

/**
 * Profile page interface
 */
export interface IProfilePage extends IBasePage {
  updateName(newName: string): Promise<void>;
  assertNameUpdated(newName: string): Promise<void>;
}

/**
 * Search page interface
 */
export interface ISearchPage extends IBasePage {
  searchFor(term: string): Promise<void>;
  assertResultsContain(text: string): Promise<void>;
  assertNoResults(): Promise<void>;
}

/**
 * Register page interface
 */
export interface IRegisterPage extends IBasePage {
  fillEmail(email: string): Promise<void>;
  fillPassword(password: string): Promise<void>;
  fillConfirmPassword(password: string): Promise<void>;
  clickSubmit(): Promise<void>;
  assertRegistrationSuccess(): Promise<void>;
  assertValidationError(fieldName: string): Promise<void>;
}
