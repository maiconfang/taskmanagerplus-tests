import { test } from '@playwright/test';
import { ProvincePage } from '../../pages/ProvincePage';

test.describe('Province Navigation', () => {
  test('should load province screen', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    await provincePage.goto();
    await provincePage.expectLoaded();
  });
});