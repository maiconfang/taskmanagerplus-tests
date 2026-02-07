import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProvincePage } from '../pages/ProvincePage';

test.describe('Province CRUD Tests', () => {
  test('should access province screen', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const provincePage = new ProvincePage(page);

    await loginPage.navigate();
    await loginPage.login('luna.moon@maif.com', '123');

    await provincePage.open();
  });

  test('should create a new province and show success toast', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const provincePage = new ProvincePage(page);

    await loginPage.navigate();
    await loginPage.login('luna.moon@maif.com', '123');

    const name = `Test Province Auto ${Date.now()}`;
    const abbr = 'TA';

    await provincePage.open();
    await provincePage.createProvince(name, abbr);

    await provincePage.open();
    await provincePage.searchByName(name);
    await provincePage.expectProvinceInTable(name);
  });

  test('should edit a province and show success toast', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const provincePage = new ProvincePage(page);

    await loginPage.navigate();
    await loginPage.login('luna.moon@maif.com', '123');

    const originalName = `Edit Province Auto ${Date.now()}`;
    const abbr = 'EA';
    const newName = `Updated Province Auto ${Date.now()}`;

    await provincePage.open();
    await provincePage.createProvince(originalName, abbr);

    await provincePage.open();
    await provincePage.searchByName(originalName);

    await provincePage.editProvinceByName(originalName, newName);

    await provincePage.open();
    await provincePage.searchByName(newName);

    // await page.pause();
    
    await provincePage.expectProvinceInTable(newName);
  });
});
