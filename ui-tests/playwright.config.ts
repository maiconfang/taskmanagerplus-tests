import { defineConfig, devices } from '@playwright/test';
import { join } from 'path';

export default defineConfig({
  // Directory where all test files are located
  testDir: './tests',

  // Maximum execution time allowed for each test (30 seconds)
  timeout: 30 * 1000,

  // Reporters configuration:
  // - 'line' prints test results directly in the terminal
  // - 'json' generates a JSON report used for further analysis or automation
  reporter: [
    ['line'], // displays test execution progress in the terminal
    ['json', { outputFile: join(__dirname, 'reports/ui/playwright-report.json') }]
  ],

  // Default settings applied to all tests
  use: {
    // Runs tests without opening a visible browser window (faster and CI-friendly)
    headless: true,

    // Takes a screenshot only when a test fails, helping with debugging
    screenshot: 'only-on-failure',

    // Records a video only if the test fails
    video: 'retain-on-failure',

    // Collects Playwright trace data for every test,
    // allowing step-by-step inspection when debugging failures
    trace: 'on',

    // Base URL used by page.goto() calls
    // Can be overridden using an environment variable
    baseURL: process.env.BASE_URL || 'http://localhost:4200'
  },

  // Test projects configuration:
  // Runs the same test suite across the main browsers
  projects: [
    {
      name: 'chromium',
      // Desktop Chrome configuration
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      // Desktop Firefox configuration
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      // Desktop Safari configuration
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
