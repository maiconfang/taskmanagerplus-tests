import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly baseURL = 'http://localhost:4200';
  readonly loginRoute = '/#/login';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto(`${this.baseURL}${this.loginRoute}`);
  }

  async fillUsername(username: string) {
    await this.page.getByRole('textbox', { name: 'Login' }).fill(username);
  }

  async fillPassword(password: string) {
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Enter' }).click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submit();
  }

  async expectWelcomeMessage(message: string) {
    await expect(this.page.getByText(message, { exact: false })).toBeVisible();
  }

  async expectLoginError(errorMessage: string) {
    await expect(this.page.getByText(errorMessage, { exact: false })).toBeVisible();
  }

  async expectValidationMessage(message: string) {
    await expect(this.page.getByText(message, { exact: false })).toBeVisible();
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(`${this.baseURL}${this.loginRoute}`);
  }
}