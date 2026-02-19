import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CrudActions } from '../components/CrudActions';

export class ProvincePage extends BasePage {
  readonly crud: CrudActions;

  // Sidebar (optional)
  readonly sidebarProvince: Locator;

  // Search
  readonly filterNameInput: Locator;

  // Register
  readonly nameInput: Locator;
  readonly abbreviationInput: Locator;

  // Table (empty state)
  readonly firstRowNameCell: Locator;
  readonly firstRowAbbreviationCell: Locator;

  constructor(page: Page) {
    super(page);

    this.crud = new CrudActions(page);

    // Sidebar
    this.sidebarProvince = page.locator('#sidebar-link-province');

    // Search
    this.filterNameInput = page.locator('#title');

    // Register
    this.nameInput = page.locator('#province-name');
    this.abbreviationInput = page.locator('#province-abbreviation');

    // Table (first row cells)
    this.firstRowNameCell = page.locator('tbody tr').first().locator('#column-province-name');
    this.firstRowAbbreviationCell = page.locator('tbody tr').first().locator('#column-province-abbreviation');
  }

  async goto(): Promise<void> {
    await this.gotoHashRoute('/app/province');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await this.expectUrl(/.*\/app\/province/);
    await expect(this.page.locator('h1')).toContainText('Consult');
  }

  async open(): Promise<void> {
    await this.sidebarProvince.click();
    await this.expectLoaded();
  }

  async goToCreate(): Promise<void> {
    await this.crud.clickCreate();
    await expect(this.page).toHaveURL(/.*\/app\/province\/new/);
  }

  async consult(): Promise<void> {
    await this.crud.clickConsult();
  }

  async searchByName(name: string): Promise<void> {
    await this.filterNameInput.fill(name);
    await this.consult();
  }

  async createProvince(name: string, abbreviation: string): Promise<void> {
    await this.goToCreate();

    await this.nameInput.fill(name);
    await this.abbreviationInput.fill(abbreviation);

    await this.crud.clickSave();
    await this.expectToastMessage('Successfully Created');

    await this.crud.backToSearch();
    await this.expectLoaded();
  }

  async editProvinceByName(originalName: string, newName: string): Promise<void> {
    const row = this.page.locator('tbody tr', { hasText: originalName }).first();
    await expect(row).toBeVisible();

    await row.locator('#action-update-province').click();
    await expect(this.page).toHaveURL(/.*\/app\/province\/\d+/);

    await this.nameInput.fill(newName);
    await this.crud.clickSave();

    await this.crud.backToSearch();
    await this.expectLoaded();
  }



  private rowByName(name: string): Locator {
    return this.page.locator('tbody tr', { hasText: name }).first();
  }

  async deleteProvinceByName(name: string): Promise<void> {
    const row = this.rowByName(name);
    await expect(row).toBeVisible();

    // Trash icon (remove) inside the row
    await row.locator('#action-remove-province').click();

    // Confirmation dialog -> Yes
    await this.page.locator('#dialog-confirmation-yes').click();
  }

  async expectProvinceNotInTable(name: string): Promise<void> {
    const row = this.rowByName(name);
    await expect
      .poll(async () => await row.count(), { timeout: 15000 })
      .toBe(0);
  }

  async expectProvinceInTable(name: string): Promise<void> {
    const row = this.page.locator('tbody tr', { hasText: name }).first();

    await expect.poll(async () => await row.count(), { timeout: 15000 }).toBeGreaterThan(0);
    await expect(row).toBeVisible();
  }


  /**
   * Empty search state for this screen renders a single blank row (not zero rows).
   * This can happen when the user searches for a province that does not exist.
   */
  async expectEmptySearchResult(): Promise<void> {
    await expect.poll(async () => {
      const name = (await this.firstRowNameCell.innerText()).trim();
      const abbr = (await this.firstRowAbbreviationCell.innerText()).trim();
      return { name, abbr };
    }, { timeout: 15000 }).toEqual({ name: '', abbr: '' });
  }

  async expectToastMessage(expectedText: string): Promise<void> {
    const toast = this.page.locator(
      `div[role="alert"].toast-message[aria-label="${expectedText}"]`
    );

    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText(expectedText);

    await toast.waitFor({ state: 'hidden', timeout: 10000 });
  }

  // Add this inside ProvincePage class
  async expectSuccessToast(message: string | RegExp) {
    const toast = this.page.locator('div[role="alert"].toast-message');

    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText(message);
  }
}
