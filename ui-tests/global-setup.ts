import { chromium, FullConfig, expect } from '@playwright/test';
import { testConfig } from './config/testConfig';
import { LoginPage } from './pages/LoginPage';

/**
 * Global setup: do UI login once and persist the authenticated storageState.
 * Then all tests can reuse the same session without repeating the login flow.
 */
async function globalSetup(config: FullConfig) {
  const storageStatePath =
    process.env.AUTH_STATE_PATH ?? 'ui-tests/.auth/storageState.json';

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Use your existing LoginPage POM (more stable than generic locators)
  const loginPage = new LoginPage(page);

  // IMPORTANT:
  // Your LoginPage currently has baseURL hardcoded.
  // If testConfig.baseUrl differs, LoginPage.navigate() will go to the hardcoded URL.
  // Recommended fix: update LoginPage to use testConfig.baseUrl.
  //
  // For now, we still call navigate() because your base URL matches.
  await loginPage.navigate();

  const username = process.env.E2E_USER ?? 'luna.moon@maif.com';
  const password = process.env.E2E_PASS ?? '123';

  await loginPage.login(username, password);

  // Wait until the app actually stores the token in localStorage (your auth mechanism)
  await expect.poll(async () => {
    return await page.evaluate(() => localStorage.getItem('token'));
  }, { timeout: 15000 }).not.toBeNull();

  await context.storageState({ path: storageStatePath });

  await browser.close();
}

export default globalSetup;
