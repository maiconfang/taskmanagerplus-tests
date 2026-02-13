import { Page, expect } from '@playwright/test';
import { testConfig } from '../config/testConfig';
import { LoginPage } from './LoginPage';

/**
 * Base class for all Page Objects
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected get baseUrl(): string {
    return testConfig.baseUrl;
  }

  /**
   * Detects whether the app is currently showing an auth/permission error page.
   * This happens when the access token expires (very common in --debug runs).
   */
  private async isAuthInvalid(): Promise<boolean> {
    // 1) Explicit "no permission" screen (your UI copy)
    const noAccessText = this.page.getByText('Application without access permission');
    if (await noAccessText.isVisible({ timeout: 250 }).catch(() => false)) return true;

    // 2) If we got redirected to login
    const url = this.page.url();
    if (url.includes('/#/login')) return true;

    // 3) Token missing entirely
    const token = await this.page.evaluate(() => localStorage.getItem('token')).catch(() => null);
    return !token;
  }

  /**
   * Re-login via UI (no manual steps) if session is invalid.
   * This is the "re-login guard" for long/paused Playwright runs.
   */
  protected async ensureAuthenticated(): Promise<void> {
    if (!(await this.isAuthInvalid())) return;

    const loginPage = new LoginPage(this.page);

    const username = process.env.E2E_USER ?? 'luna.moon@maif.com';
    const password = process.env.E2E_PASS ?? '123';

    await loginPage.navigate();
    await loginPage.login(username, password);

    // Wait for token to be present again
    await expect
      .poll(async () => this.page.evaluate(() => localStorage.getItem('token')), { timeout: 15000 })
      .not.toBeNull();
  }

  /**
   * Navigates to an Angular hash route (ex: "/app/province").
   */
  protected async gotoHashRoute(route: string): Promise<void> {
    const normalized = route.startsWith('/') ? route.slice(1) : route;
    const url = `${this.baseUrl}/#/${normalized}`;

    // First attempt
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');

    // If token expired or we got redirected, re-login and retry navigation.
    if (await this.isAuthInvalid()) {
      await this.ensureAuthenticated();
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    await this.page.waitForLoadState('networkidle');
  }

  protected async expectUrl(regex: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(regex);
  }
}
