import { test, expect } from '@playwright/test';
import { ProvincePage } from '../../../pages/ProvincePage';

/**
 * Failure Scenario (UI / Timing):
 * Users can type a filter and click "Consult Records" quickly while the grid refresh is still pending.
 * This test intentionally uses an unrealistically small timeout to trigger a timing failure,
 * producing a classic Playwright error (timeout / element not found) that the Analyzer can learn from.
 */
test.describe('[FailureScenario][UI][Timing] Grid refresh race', () => {
  test('should find Ontario immediately after searching (intentional timing failure)', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    await provincePage.goto();

    await provincePage.searchByName('Ontario');

    const row = page.locator('tbody tr', { hasText: 'Ontario' }).first();

    // Intentionally tiny timeout to trigger a failure in realistic slower environments.
    await expect(row).toBeVisible({ timeout: 200 });
  });
});
