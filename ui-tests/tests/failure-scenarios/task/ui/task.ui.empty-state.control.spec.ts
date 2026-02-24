import { test } from '@playwright/test';
import { TaskPage } from '../../../../pages/TaskPage';

/**
 * Failure Scenario Suite Control (Task / UI / EmptyState):
 * This is a REAL validation and should PASS. It is included as a control test inside
 * the failure-scenarios suite (useful for Analyzer comparisons: pass vs fail).
 */
test.describe('[FailureScenario][Task][UI][EmptyState] Non-existing task search (control/pass)', () => {
  test('should show "No records found" when search returns no results (control)', async ({ page }) => {
    const taskPage = new TaskPage(page);

    await taskPage.gotoSearch();
    await taskPage.clearFilters();

    const notExisting = `__not_existing_task__${Date.now()}`;
    await taskPage.searchByTitle(notExisting);

    await taskPage.expectNoRecordsFound();
  });
});
