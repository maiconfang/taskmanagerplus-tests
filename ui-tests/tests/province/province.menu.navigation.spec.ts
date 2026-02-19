import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProvincePage } from '../../pages/ProvincePage';

test.describe('Province Menu Navigation', () => {
  test('should navigate to Province screen using the sidebar menu', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const provincePage = new ProvincePage(page);

    // Login (use env vars if provided; otherwise defaults are handled by BasePage in app routes)
    await loginPage.navigate();
    await loginPage.login(process.env.E2E_USER ?? 'luna.moon@maif.com', process.env.E2E_PASS ?? '123');

    // After login, the app usually redirects away from /#/login.
    await expect(page).not.toHaveURL(/#\/login/i, { timeout: 20000 });

    // Click Province in sidebar menu (real user navigation)
    await provincePage.open();

    // Final assertion: Province screen loaded
    await provincePage.expectLoaded();
  });
});
