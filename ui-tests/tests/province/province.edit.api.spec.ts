import { test } from '@playwright/test';
import { ProvincePage } from '../../pages/ProvincePage';
import { createProvince, deleteProvince } from '../../api/provinceClient';

test('should edit a province using API setup and cleanup', async ({ page }) => {
  const provincePage = new ProvincePage(page);

  const originalName = `Edit Province Auto ${Date.now()}`;
  const newName = `Updated Province Auto ${Date.now()}`;

  // Setup via API
  const province = await createProvince(originalName, 'EA');

  try {
    await provincePage.goto();
    await provincePage.searchByName(originalName);
    await provincePage.editProvinceByName(originalName, newName);

    await provincePage.expectSuccessToast('Successfully Updated');
    
    //await page.pause();
    
    await provincePage.searchByName(newName);
    await provincePage.expectProvinceInTable(newName);

  } finally {
    // Cleanup via API
    await deleteProvince(province.id);
  }
});