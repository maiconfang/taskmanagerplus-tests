// import { test } from '@playwright/test';
// import { ProvincePage } from '../../pages/ProvincePage';
// import { createProvince, deleteProvince } from '../../api/provinceClient';

// test.describe('Province Delete (API Setup)', () => {
//   test('should delete a province via UI', async ({ page }) => {
//     const provincePage = new ProvincePage(page);

//     const name = `Delete Province Auto ${Date.now()}`;
//     const province = await createProvince(name, 'DP');

//     await provincePage.goto();
//     await provincePage.searchByName(name);
//     await provincePage.deleteProvinceByName(name);

//     await provincePage.expectSuccessToast(/Successfully/i);

//     await deleteProvince(province.id); // fallback cleanup
//   });
// });