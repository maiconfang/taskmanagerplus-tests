import { Page, Locator, expect } from '@playwright/test';

export class ProvincePage {
  readonly page: Page;

  // Sidebar navigation
  readonly sidebarProvince: Locator;

  // Search screen
  readonly filterNameInput: Locator;
  readonly consultButton: Locator;
  readonly createButton: Locator;
  readonly table: Locator;

  // Register screen (create/edit)
  readonly nameInput: Locator;
  readonly abbreviationInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar
    this.sidebarProvince = page.locator('#sidebar-link-province');

    // Search
    this.filterNameInput = page.locator('#title');
    this.consultButton = page.locator('#btn-consult-records');
    this.createButton = page.locator('#btn-create-record');
    this.table = page.locator('table');

    // Register
    this.nameInput = page.locator('#province-name');
    this.abbreviationInput = page.locator('#province-abbreviation');
    this.saveButton = page.locator('#btn-save-province');
  }

  async open(): Promise<void> {
    await this.sidebarProvince.click();
    await expect(this.page).toHaveURL(/.*\/app\/province/);
    // Ensure the screen is loaded
    await expect(this.page.locator('h1')).toContainText('Consult');
  }

  async goToCreate(): Promise<void> {
    await this.createButton.click();
    await expect(this.page).toHaveURL(/.*\/app\/province\/new/);
  }

  async consult(): Promise<void> {
    await this.consultButton.click();
    // Table should be visible after consulting
    await expect(this.table).toBeVisible();
  }

  async searchByName(name: string): Promise<void> {
    await this.filterNameInput.fill(name);
    await this.consult();
  }

  async createProvince(name: string, abbreviation: string): Promise<void> {
    await this.goToCreate();

    await this.nameInput.fill(name);
    await this.abbreviationInput.fill(abbreviation);
    await this.saveButton.click();

    await this.expectToastMessage('Successfully Created');
  }

  async editProvinceByName(originalName: string, newName: string): Promise<void> {
    // Find the row that contains the province name and click its Edit action
    const row = this.page.locator('tbody tr', { hasText: originalName }).first();
    await expect(row).toBeVisible();

    await row.locator('#action-update-province').click();
    await expect(this.page).toHaveURL(/.*\/app\/province\/\d+/);

    await this.nameInput.fill(newName);
    await this.saveButton.click();

    await this.expectToastMessage('Successfully Updated');
  }

async expectProvinceInTable(name: string): Promise<void> {
  const row = this.page.locator('tbody tr', { hasText: name }).first();
  await expect.poll(async () => await row.count(), { timeout: 15000 }).toBeGreaterThan(0);
  await expect(row).toBeVisible();
}



async expectToastMessage(expectedText: string): Promise<void> {
  const toast = this.page.locator(
    `div[role="alert"].toast-message[aria-label="${expectedText}"]`
  );

  await expect(toast).toBeVisible({ timeout: 5000 });
  await expect(toast).toContainText(expectedText);

  // optional: wait it to disappear to avoid stacking
  await toast.waitFor({ state: 'hidden', timeout: 10000 });
}

}
