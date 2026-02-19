import { test } from '@playwright/test';
import { ProvincePage } from '../../pages/ProvincePage';

test.describe('Province Search', () => {
  test('should show empty results when searching for a non-existing province', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    await provincePage.goto();

    const notExisting = `__not_existing__${Date.now()}`;
    await provincePage.searchByName(notExisting);

    await provincePage.expectEmptySearchResult();

    // Optional extra guard (still clean, still Page Object based)
    await provincePage.expectProvinceNotInTable(notExisting);
  });
});
