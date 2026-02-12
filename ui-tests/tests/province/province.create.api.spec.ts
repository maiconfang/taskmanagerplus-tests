import { test } from '@playwright/test';
import { ProvincePage } from '../../pages/ProvincePage';
import { createProvince, deleteProvince } from '../../api/provinceClient';

test.describe('Province Create (API Validation)', () => {
  test('should create a province via UI and validate via API', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    const name = `Create Province Auto ${Date.now()}`;

    const province = await createProvince(name, 'CP');

    try {
      await provincePage.goto();
      await provincePage.searchByName(name);
      await provincePage.expectProvinceInTable(name);
    } finally {
      await deleteProvince(province.id);
    }
  });
});