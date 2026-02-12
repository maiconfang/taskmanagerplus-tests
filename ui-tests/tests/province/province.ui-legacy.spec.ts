import { test } from '@playwright/test';
import { ProvincePage } from '../../pages/ProvincePage';

test.describe('Province UI Legacy Full Flow', () => {
  test('should create, edit and validate province via full UI flow', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    const originalName = `Legacy Province ${Date.now()}`;
    const newName = `Legacy Updated ${Date.now()}`;

    await provincePage.goto();
    await provincePage.createProvince(originalName, 'LG');

    await provincePage.searchByName(originalName);
    await provincePage.editProvinceByName(originalName, newName);

    await provincePage.searchByName(newName);
    await provincePage.expectProvinceInTable(newName);
  });
});