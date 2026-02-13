import { defineConfig, devices } from '@playwright/test';
import { join } from 'path';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,

  globalSetup: require.resolve('./global-setup'),

  reporter: [
    ['line'],
    ['json', { outputFile: join(__dirname, 'reports/ui/playwright-report.json') }],
  ],

  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on',

    // Standardize on APP_BASE_URL (used by global-setup too)
    baseURL: process.env.APP_BASE_URL || 'http://192.168.2.12:4200',

    // Reuse the logged-in session for all tests
    storageState: process.env.AUTH_STATE_PATH
      ? path.resolve(__dirname, process.env.AUTH_STATE_PATH)
      : path.resolve(__dirname, '.auth/storageState.json'),
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
