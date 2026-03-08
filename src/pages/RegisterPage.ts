import { BasePage } from './base/BasePage';
import { IRegisterPage } from '../interface/pages.interface';

/**
 * Register Page Object Model
 * Handles user registration form interactions
 *
 * Note: This page uses the demo site placeholder selectors.
 * Update selectors based on your application's HTML structure.
 */
export class RegisterPage extends BasePage implements IRegisterPage {
  /**
   * Navigate to registration page
   */
  async goto(): Promise<void> {
    await this.page.goto('https://demo.automationtesting.in/Register.html');
    await this.waitForPageLoad();
  }

  /**
   * Fill first name field
   */
  async fillFirstName(name: string): Promise<void> {
    await this.page.fill('input[placeholder="First Name"]', name);
  }

  /**
   * Fill last name field
   */
  async fillLastName(name: string): Promise<void> {
    await this.page.fill('input[placeholder="Last Name"]', name);
  }

  /**
   * Fill address field
   */
  async fillAddress(address: string): Promise<void> {
    await this.page.fill('textarea[ng-model="Adress"]', address);
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    // Prefer getByRole for form inputs when possible
    await this.page.fill('input[type="email"]', email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.page.fill('input[type="password"]', password);
  }

  /**
   * Fill confirm password field
   */
  async fillConfirmPassword(password: string): Promise<void> {
    const inputs = await this.page.locator('input[type="password"]').all();
    if (inputs.length >= 2) {
      await inputs[1].fill(password);
    }
  }

  /**
   * Fill phone field
   */
  async fillPhone(phone: string): Promise<void> {
    await this.page.fill('input[type="tel"]', phone);
  }

  /**
   * Select gender option
   */
  async selectGender(gender: 'Male' | 'Female'): Promise<void> {
    await this.page.check(`input[value="${gender}"]`);
  }

  /**
   * Select hobby checkbox
   */
  async selectHobby(hobby: string): Promise<void> {
    await this.page.check(`input[value="${hobby}"]`);
  }

  /**
   * Select skill from dropdown
   */
  async selectSkill(skill: string): Promise<void> {
    await this.page.selectOption('#Skills', skill);
  }

  /**
   * Select country from dropdown
   */
  async selectCountry(country: string): Promise<void> {
    await this.page.selectOption('#countries', country);
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.getByRole('button', { name: /submit|register/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Assert registration was successful
   */
  async assertRegistrationSuccess(): Promise<void> {
    // Check for success message or redirect
    await this.page.waitForURL(/.*success|registered.*/i);
  }

  /**
   * Assert validation error appears for a specific field
   */
  async assertValidationError(fieldName: string): Promise<void> {
    const errorLocator = this.getByText(new RegExp(`${fieldName}.*required|invalid`, 'i'));
    await errorLocator.waitFor({ state: 'visible' });
  }
}
