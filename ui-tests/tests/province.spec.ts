import { test } from '@playwright/test';
import { ProvincePage } from '../pages/ProvincePage';

/*
Run in debug mode
npx playwright test -g "should access province screen, no login required" --debug --headed --project=chromium
npx playwright test -g "should create a new province and show success toast" --debug --headed --project=chromium
npx playwright test -g "should edit a province and show success toast" --debug --headed --project=chromium

*/ 


test.describe('Province CRUD Tests', () => {
  test('should access province screen, no login required', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    await provincePage.goto();
    await provincePage.expectLoaded();
  });

  test('should create a new province and show success toast', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    const name = `Test Province Auto ${Date.now()}`;
    const abbr = 'TA';

    await provincePage.goto();
    await provincePage.createProvince(name, abbr);

    await provincePage.goto();
    await provincePage.searchByName(name);
    await provincePage.expectProvinceInTable(name);
  });

  test('should edit a province and show success toast', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    const originalName = `Edit Province Auto ${Date.now()}`;
    const abbr = 'EA';
    const newName = `Updated Province Auto ${Date.now()}`;

    await provincePage.goto();
    await provincePage.createProvince(originalName, abbr);

    await provincePage.goto();
    await provincePage.searchByName(originalName);
    await provincePage.editProvinceByName(originalName, newName);

    await provincePage.goto();
    await provincePage.searchByName(newName);
    await provincePage.expectProvinceInTable(newName);
  });
});
