import { test, expect } from '@playwright/test';
import { ProvincePage } from '../../pages/ProvincePage';
import { createProvince, getProvinceById, listProvinces } from '../../api/provinceClient';

test.describe('Province Delete (API-driven)', () => {
  test('should delete a province via UI and validate removal', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    const name = `Delete Province Auto ${Date.now()}`;

    // Setup via API (stable + fast)
    const province = await createProvince(name, 'DP');

    // UI: delete
    await provincePage.goto();
    await provincePage.searchByName(name);
    await provincePage.expectProvinceInTable(name);

    await provincePage.deleteProvinceByName(name);

    // Toast (UI feedback)
    await provincePage.expectToastMessage('Successfully Removed');

    // UI: row disappears (handles async grid refresh)
    await provincePage.expectProvinceNotInTable(name);

    // API: ground-truth validation (either 404 or not present)
    const res = await getProvinceById(province.id);
    if (res.status() === 404) {
      expect(res.status()).toBe(404);
    } else {
      const provinces = await listProvinces();
      const stillExists = Array.isArray(provinces) && provinces.some((p: any) => p.id === province.id);
      expect(stillExists).toBeFalsy();
    }
  });
});
