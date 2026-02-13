import { Page, Locator, expect } from '@playwright/test';
import { testConfig } from '../config/testConfig';

export class LoginPage {
  readonly page: Page;

  // Route (Angular hash routing)
  readonly loginRoute = '/#/login';

  // Locators (resilient: supports small UI changes without breaking auth)
  readonly loginInput: Locator;
  readonly passwordInput: Locator;
  readonly enterButton: Locator;

  // Optional (nice-to-have)
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;

    // Keep title as optional (some builds may not render it)
    this.title = page.locator('#login_page_title_label');

    // Use a multi-selector locator to avoid brittle id assumptions.
    // It matches the first element that exists.
    this.loginInput = page.locator(
      [
        '#login_username',
        '#login_user',
        '#username',
        'input[name="username"]',
        'input[name="email"]',
        'input[formcontrolname="username"]',
        'input[formcontrolname="email"]',
        'input[type="email"]',
        'input[type="text"]',
      ].join(', ')
    );

    this.passwordInput = page.locator(
      [
        '#login_password',
        '#password',
        'input[name="password"]',
        'input[formcontrolname="password"]',
        'input[type="password"]',
      ].join(', ')
    );

    // Button text varies sometimes; use a forgiving matcher.
    this.enterButton = page.getByRole('button', { name: /^(enter|login|sign in)$/i });
  }

  async navigate(baseUrl: string = (process.env.APP_BASE_URL ?? testConfig.baseUrl)) {
    await this.page.goto(`${baseUrl}${this.loginRoute}`, { waitUntil: 'domcontentloaded' });
    await this.expectLoginPageReady();
  }

  // "Ready check" (helps avoid timeout/flakiness)
  async expectLoginPageReady() {
    // Don't over-constrain URL; hash routing can include additional params.
    await expect(this.page).toHaveURL(/#\/login/i, { timeout: 20000 });

    // Some builds may not show the title label; treat it as optional.
    await this.title
      .first()
      .isVisible({ timeout: 500 })
      .catch(() => false);

    // The real "must-haves"
    await expect(this.loginInput.first()).toBeVisible({ timeout: 20000 });
    await expect(this.passwordInput.first()).toBeVisible({ timeout: 20000 });
    await expect(this.enterButton.first()).toBeVisible({ timeout: 20000 });
  }

  // Actions
  async fillLogin(username: string) {
    await expect(this.loginInput.first()).toBeVisible({ timeout: 20000 });
    await this.loginInput.first().fill(username);
  }

  async fillPassword(password: string) {
    await expect(this.passwordInput.first()).toBeVisible({ timeout: 20000 });
    await this.passwordInput.first().fill(password);
  }

  async submit() {
    await expect(this.enterButton.first()).toBeVisible({ timeout: 20000 });
    await expect(this.enterButton.first()).toBeEnabled({ timeout: 20000 });
    await this.enterButton.first().click();
  }

  async login(username: string, password: string) {
    await this.fillLogin(username);
    await this.fillPassword(password);
    await this.submit();
  }

  async logout() {
    const logoutButton = this.page.locator('#btn-logout');

    await expect(logoutButton).toBeVisible({ timeout: 15000 });
    await expect(logoutButton).toBeEnabled();

    await logoutButton.scrollIntoViewIfNeeded();
    await logoutButton.click();
  }
}
