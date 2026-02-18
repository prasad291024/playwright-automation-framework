import { Page } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://demo.automationtesting.in/Register.html');
  }

  async fillFirstName(name: string) {
    await this.page.fill('input[placeholder="First Name"]', name);
  }

  async fillLastName(name: string) {
    await this.page.fill('input[placeholder="Last Name"]', name);
  }

  async fillAddress(address: string) {
    await this.page.fill('textarea[ng-model="Adress"]', address);
  }

  async fillEmail(email: string) {
    await this.page.fill('input[type="email"]', email);
  }

  async fillPhone(phone: string) {
    await this.page.fill('input[type="tel"]', phone);
  }

  async selectGender(gender: 'Male' | 'Female') {
    await this.page.check(`input[value="${gender}"]`);
  }

  async selectHobby(hobby: string) {
    await this.page.check(`input[value="${hobby}"]`);
  }

  async selectSkill(skill: string) {
    await this.page.selectOption('#Skills', skill);
  }

  async selectCountry(country: string) {
    await this.page.selectOption('#countries', country);
  }
}
