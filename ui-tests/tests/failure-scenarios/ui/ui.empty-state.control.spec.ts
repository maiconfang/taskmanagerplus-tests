import { test, expect } from '@playwright/test';
import { ProvincePage } from '../../../pages/ProvincePage';

/**
 * Failure Scenario (UI / Empty State):
 * When searching for a province that does not exist, the UI renders a single blank row.
 * This test is a REAL validation and should PASS. It's included as a control test inside
 * the failure-scenarios suite (useful for Analyzer comparisons: pass vs fail).
 */
test.describe('[FailureScenario][UI][EmptyState] Non-existing province search', () => {
  test('should render a blank row when no results are found (control/pass)', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    await provincePage.goto();

    const notExisting = `__not_existing__${Date.now()}`;
    await provincePage.searchByName(notExisting);

    await provincePage.expectEmptySearchResult();
    await expect(page.locator('tbody')).not.toContainText(notExisting);
  });
});
