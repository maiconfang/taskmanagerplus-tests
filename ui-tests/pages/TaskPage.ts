import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Task screen Page Object
 *
 * Covers:
 * - Consult Task (search)
 * - New Task / Edit Task (register)
 */
export class TaskPage extends BasePage {
  // --- Search (Consult Task)
  readonly createRecordButton: Locator;
  readonly consultRecordsButton: Locator;

  readonly titleFilterInput: Locator;
  readonly descriptionFilterInput: Locator;
  readonly dueDateFilterInput: Locator;
  readonly completedFilterCheckbox: Locator;
  readonly notCompletedFilterCheckbox: Locator;

  readonly noContentRow: Locator;
  readonly noContentMessage: Locator;
  readonly titleInput: Locator;
  readonly rows: Locator;

  // --- Register (New/Edit)
  readonly registerTitleInput: Locator;
  readonly registerDescriptionInput: Locator;
  readonly registerDueDateInput: Locator;
  readonly registerCompletedCheckbox: Locator;
  readonly saveButton: Locator;
  readonly backToSearchButton: Locator;

  constructor(page: Page) {
    super(page);

    // Search
    this.createRecordButton = page.locator('#task-search-btn-create-record');
    this.consultRecordsButton = page.locator('#task-search-btn-consult-records');

    this.titleFilterInput = page.locator('#task-search-title');
    this.descriptionFilterInput = page.locator('#task-search-description');
    this.dueDateFilterInput = page.locator('#task-search-due-date');
    this.completedFilterCheckbox = page.locator('#task-search-completed');
    this.notCompletedFilterCheckbox = page.locator('#task-search-not-completed');

    this.noContentRow = page.locator('#task-search-no-content');
    this.noContentMessage = page.locator('#task-search-no-content-message');
    this.titleInput = page.locator('#task-search-title');

    // Rows (exclude the "no content" message row)
    this.rows = page.locator('tbody tr').filter({ hasNot: this.noContentRow });

    // Register
    this.registerTitleInput = page.locator('#task-register-title');
    this.registerDescriptionInput = page.locator('#task-register-description');
    this.registerDueDateInput = page.locator('#task-register-duedate');
    this.registerCompletedCheckbox = page.locator('#task-register-completed');
    this.saveButton = page.locator('#task-register-btn-save-task');
    this.backToSearchButton = page.locator('#task-register-btn-back');
  }

  // -------------------------
  // Navigation / Loaded checks
  // -------------------------

  async gotoSearch(): Promise<void> {
    await this.gotoHashRoute('/app/task');
    await this.expectSearchLoaded();
  }

  async expectSearchLoaded(): Promise<void> {
    await this.expectUrl(/.*\/app\/task(\?.*)?$/);
    // Screen title is translated, but in your UI it renders "Consult Task"
    await expect(this.page.locator('h1')).toContainText('Consult');
    await expect(this.createRecordButton).toBeVisible();
    await expect(this.consultRecordsButton).toBeVisible();
  }

  async expectRegisterLoaded(): Promise<void> {
    await this.expectUrl(/.*\/app\/task\/(new|\d+)(\?.*)?$/);
    await expect(this.registerTitleInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
    await expect(this.backToSearchButton).toBeVisible();
  }

  // -------------------------
  // Search actions
  // -------------------------

  async clickCreateRecord(): Promise<void> {
    await this.createRecordButton.click();
    await this.expectRegisterLoaded();
  }

  async consult(): Promise<void> {
    await this.consultRecordsButton.click();
    await expect(this.page.locator('table')).toBeVisible();
  }

  async clearFilters(): Promise<void> {
    await this.titleFilterInput.fill('');
    await this.descriptionFilterInput.fill('');
    await this.dueDateFilterInput.fill('');
    await this.completedFilterCheckbox.setChecked(false);
    await this.notCompletedFilterCheckbox.setChecked(false);
  }

  async filterByTitle(title: string): Promise<void> {
    await this.titleFilterInput.fill(title);
  }

  async filterByDescription(description: string): Promise<void> {
    await this.descriptionFilterInput.fill(description);
  }

  /**
   * The UI uses a bsDatepicker with dateInputFormat: YYYY/MM/DD.
   * Typing is allowed and is easier for stable automation.
   */
  async filterByDueDate(dateYYYYMMDD: string): Promise<void> {
    await this.dueDateFilterInput.fill(dateYYYYMMDD);
    // Trigger blur/validation
    await this.page.locator('h1').first().click();
  }

  async setCompletedFilter(checked: boolean): Promise<void> {
    await this.completedFilterCheckbox.setChecked(checked);
  }

  async setNotCompletedFilter(checked: boolean): Promise<void> {
    await this.notCompletedFilterCheckbox.setChecked(checked);
  }

  // -------------------------
  // Assertions / table helpers
  // -------------------------

  private rowByTitle(title: string): Locator {
    return this.page.locator('tbody tr', { hasText: title }).filter({ hasNot: this.noContentRow }).first();
  }

  async expectAtLeastOneResult(): Promise<void> {
    await expect.poll(async () => await this.rows.count(), { timeout: 15000 }).toBeGreaterThan(0);
  }

  async expectNoContent(): Promise<void> {
    await expect(this.noContentRow).toBeVisible();
    await expect(this.noContentMessage).toBeVisible();
  }

  async expectTaskInTable(title: string): Promise<void> {
    const row = this.rowByTitle(title);
    await expect.poll(async () => await row.count(), { timeout: 15000 }).toBeGreaterThan(0);
    await expect(row).toBeVisible();
  }

  async expectTaskNotInTable(title: string): Promise<void> {
    const row = this.rowByTitle(title);
    await expect.poll(async () => await row.count(), { timeout: 15000 }).toBe(0);
  }

  async expectAllRowsCompletedValue(expectedText: 'Yes' | 'No'): Promise<void> {
    await this.expectAtLeastOneResult();
    const count = await this.rows.count();

    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      const completedCell = row.locator('#task-search-column-task-completed');
      await expect(completedCell).toBeVisible();
      await expect(completedCell).toHaveText(expectedText);
    }
  }

  // Filter tasks by title and execute search
  async searchByTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
    await this.consult();
  }

  // Validate the completed value of a specific row identified by title
  async expectRowCompletedValue(title: string, expected: 'Yes' | 'No'): Promise<void> {
    const row = this.page.locator('tbody tr', { hasText: title });

    // Locate the Completed column inside the matched row
    const completedCell = row.locator('#task-search-column-task-completed');

    await expect(completedCell).toHaveText(expected);
  }

}
