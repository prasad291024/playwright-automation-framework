/**
 * Centralized Selector Strategy
 *
 * Selector Priority (Most to Least Resilient):
 * 1. data-testid - Most resilient, explicit test identifiers
 * 2. getByRole - Accessible, captures intent
 * 3. getByPlaceholder - Good for form inputs
 * 4. getByText - Good for buttons/links with visible text
 * 5. CSS selectors - Last resort, brittle, prone to breaking
 *
 * Guidelines:
 * - Use data-testid for elements that need stable selectors
 * - Use roles for semantic HTML (buttons, links, headings)
 * - Avoid brittle CSS: class names, IDs that change frequently
 * - Prefer Playwright locators (getByRole, getByTestId) over raw CSS
 */

/**
 * Selector object using testIds (preferred)
 * These assume your app uses data-testid attributes
 */
export const SELECTORS_BY_TESTID = {
  login: {
    usernameInput: 'username-field',
    passwordInput: 'password-field',
    submitButton: 'login-button',
    errorMessage: 'login-error',
  },
  dashboard: {
    welcomeHeader: 'welcome-header',
    profileLink: 'profile-nav-link',
    profileButton: 'profile-button',
  },
  search: {
    input: 'search-input',
    results: 'search-results',
    resultItem: 'search-result-item',
    noResults: 'no-results-message',
  },
  profile: {
    nameInput: 'name-input',
    saveButton: 'save-button',
    nameDisplay: 'name-display',
    emailInput: 'email-input',
  },
};

/**
 * CSS/XPath selectors (fallback - use cautiously)
 * These are brittle and should only be used when:
 * - Element has no test ID
 * - Element has no semantic role
 * - Placeholder/text matching not suitable
 */
export const SELECTORS = {
  login: {
    usernameInput: '#username',
    passwordInput: '#password',
    submitButton: '#login-button',
    errorMessage: '.error-message',
  },
  dashboard: {
    welcomeHeader: 'h1.welcome',
    profileLink: '#profile-link',
  },
  search: {
    input: 'input[placeholder="Search"]',
    results: 'article',
    noResults: '.no-results',
  },
  profile: {
    nameInput: '#name-input',
    saveButton: '#save-button',
    nameDisplay: '#name-display',
  },
};
