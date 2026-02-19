import { test, expect } from '@playwright/test';
import { ProvincePage } from '../../pages/ProvincePage';

/**
 * Failure Scenario (UI / Auth):
 * A real user can lose the session (expired cookie/token) and be redirected to login.
 * This test intentionally assumes the user is already authenticated and will FAIL
 * when the app redirects to login.
 */
test.describe('[FailureScenario][UI][Auth] Province page requires session', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should open Province page without login (intentional failure)', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    // This will likely redirect to /login or show the login screen.
    await provincePage.goto();

    // Intentionally strict expectation: the page is loaded as if authenticated.
    // Expected failure: "Consult" header not found / URL mismatch.
    await provincePage.expectLoaded();
  });
});
