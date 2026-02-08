import { Page, Locator, expect } from '@playwright/test';

/**
 * Reusable CRUD toolbar/actions used across multiple screens
 * (Province, User, Task, etc.)
 */
export class CrudActions {
  readonly page: Page;

  readonly createButton: Locator;
  readonly consultButton: Locator;
  readonly saveButton: Locator;
  readonly backButton: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    this.page = page;

    // Standard CRUD buttons (based on your current HTML)
    this.createButton = page.locator('#btn-create-record');
    this.consultButton = page.locator('#btn-consult-records');
    this.saveButton = page.locator('#btn-save-province');
    this.backButton = page.locator('#btn-back');

    this.table = page.locator('table');
  }

  async clickCreate(): Promise<void> {
    await this.createButton.click();
  }

  async clickConsult(): Promise<void> {
    await this.consultButton.click();
    await expect(this.table).toBeVisible();
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  async backToSearch(): Promise<void> {
    await this.backButton.click();
  }
}
