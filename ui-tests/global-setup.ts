import { chromium, FullConfig, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { LoginPage } from './pages/LoginPage';

/**
 * Global setup: do UI login once and persist the authenticated storageState.
 * All tests can reuse the same session without repeating the login flow.
 *
 * Troubleshooting:
 * - If this fails, we write a screenshot + html snapshot under `.auth/debug/`
 *   so you can see what page actually opened (wrong baseURL, redirect, etc).
 */
async function globalSetup(config: FullConfig) {
  const storageStatePath = path.resolve(
    __dirname,
    process.env.AUTH_STATE_PATH ?? '.auth/storageState.json'
  );

  const debugDir = path.resolve(__dirname, '.auth/debug');
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });
  fs.mkdirSync(debugDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  // Prefer APP_BASE_URL (single source of truth).
  const baseURL =
    process.env.APP_BASE_URL ??
    ((config?.projects?.[0]?.use as any)?.baseURL ?? 'http://192.168.2.12:4200');

  const username = process.env.E2E_USER ?? 'luna.moon@maif.com';
  const password = process.env.E2E_PASS ?? '123';

  try {
    await loginPage.navigate(baseURL);
    await loginPage.login(username, password);

    // Wait until token is stored
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('token')), { timeout: 20000 })
      .not.toBeNull();

    await context.storageState({ path: storageStatePath });
  } catch (err) {
    // Capture what happened to make it easy to diagnose.
    const ts = Date.now();
    await page.screenshot({ path: path.join(debugDir, `global-setup-fail-${ts}.png`), fullPage: true });
    fs.writeFileSync(
      path.join(debugDir, `global-setup-fail-${ts}.html`),
      await page.content(),
      'utf-8'
    );
    fs.writeFileSync(
      path.join(debugDir, `global-setup-fail-${ts}.txt`),
      `URL: ${page.url()}\nAPP_BASE_URL: ${baseURL}\nAUTH_STATE_PATH: ${storageStatePath}\n`,
      'utf-8'
    );
    throw err;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
