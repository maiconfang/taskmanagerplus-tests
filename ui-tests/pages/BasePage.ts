import { Page, expect } from '@playwright/test';
import { testConfig } from '../config/testConfig';

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
   * Navigates to an Angular hash route (ex: "/app/province").
   */
  protected async gotoHashRoute(route: string): Promise<void> {
    const normalized = route.startsWith('/') ? route.slice(1) : route;
    const url = `${this.baseUrl}/#/${normalized}`;

    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  protected async expectUrl(regex: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(regex);
  }
}
