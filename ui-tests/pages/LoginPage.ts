import { Page, Locator, expect } from '@playwright/test';
import { testConfig } from '../config/testConfig';

export class LoginPage {
  readonly page: Page;

  // Route
  readonly loginRoute = '/#/login';

  // Locators (centralizados)
  readonly title: Locator;
  readonly loginInput: Locator;
  readonly passwordInput: Locator;
  readonly enterButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.locator('#login_page_title_label');
    this.loginInput = page.locator('#login_username');
    this.passwordInput = page.locator('#login_password');
    this.enterButton = page.getByRole('button', { name: 'Enter' });
  }

  async navigate() {
    await this.page.goto(`${testConfig.baseUrl}${this.loginRoute}`, { waitUntil: 'domcontentloaded' });
    await this.expectLoginPageReady();
  }

  // "Ready check" (ajuda muito a evitar timeout/flakiness)
  async expectLoginPageReady() {
    await expect(this.page).toHaveURL(`${testConfig.baseUrl}${this.loginRoute}`);
    await expect(this.title).toBeVisible();
    await expect(this.loginInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.enterButton).toBeVisible();
  }

  // Actions
  async fillLogin(username: string) {
    await expect(this.loginInput).toBeVisible();
    await this.loginInput.fill(username);
  }

  async fillPassword(password: string) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  async clickOnLoginField() {
    await expect(this.loginInput).toBeVisible();
    await expect(this.loginInput).toBeEnabled();
    await this.loginInput.click();
  }

  async clickOnPasswordField() {
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();
    await this.passwordInput.click();
  }

  // Click outside to trigger blur/validation
  async blurInputs() {
    await expect(this.title).toBeVisible();
    await this.title.scrollIntoViewIfNeeded();
    await this.title.click();
  }

  async submit() {
    await expect(this.enterButton).toBeVisible();
    await expect(this.enterButton).toBeEnabled();
    await this.enterButton.click();
  }

  async login(username: string, password: string) {
    await this.fillLogin(username);
    await this.fillPassword(password);
    await this.submit();
  }

  // Expectations
  async expectTitleVisible() {
    await expect(this.title).toBeVisible();
  }

  async expectValidationMessage(message: string) {
    await expect(this.page.getByText(message, { exact: false })).toBeVisible();
  }

  async expectLoginError(errorMessage: string) {
    await expect(this.page.getByText(errorMessage, { exact: false })).toBeVisible();
  }

  async expectWelcomeMessage(message: string) {
    await expect(this.page.getByText(message, { exact: false })).toBeVisible();
  }

  async logout() {
    const logoutButton = this.page.locator('#btn-logout');

    await expect(logoutButton).toBeVisible();
    await expect(logoutButton).toBeEnabled();

    await logoutButton.scrollIntoViewIfNeeded();
    await logoutButton.click();
  }
}
