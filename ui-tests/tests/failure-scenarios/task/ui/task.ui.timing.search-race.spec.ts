import { test, expect } from '@playwright/test';
import { TaskPage } from '../../../../pages/TaskPage';

/**
 * Failure Scenario (Task / UI / Timing):
 * Users can click "Consult Records" quickly while the grid refresh is still pending.
 * This test intentionally uses an unrealistically small timeout to trigger a timing failure,
 * producing a classic Playwright error (timeout / element not found) that the Analyzer can learn from.
 */
test.describe('[FailureScenario][Task][UI][Timing] Grid refresh race', () => {
  test('should find a row immediately after consulting (intentional timing failure)', async ({ page }) => {
    const taskPage = new TaskPage(page);

    await taskPage.gotoSearch();
    await taskPage.clearFilters();

    await taskPage.setCompletedFilter(true);
    await taskPage.consult();

    // Intentionally tiny timeout to increase the chance of failure in fast/async UIs.
    const anyRow = page.locator('tbody tr').first();
    await expect(anyRow).toBeVisible({ timeout: 50 });
  });
});
