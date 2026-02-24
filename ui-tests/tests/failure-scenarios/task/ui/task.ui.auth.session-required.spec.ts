import { test, expect } from '@playwright/test';
import { TaskPage } from '../../../../pages/TaskPage';

/**
 * Failure Scenario (Task / UI / Auth):
 * A user can lose the session (expired cookie/token) and be redirected to login.
 * This test intentionally assumes the user is already authenticated and will FAIL
 * when the app redirects to login.
 */
test.describe('[FailureScenario][Task][UI][Auth] Task page requires session', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should open Task page without login (intentional failure)', async ({ page }) => {
    const taskPage = new TaskPage(page);

    await taskPage.gotoSearch();

    // Intentionally wrong expectation: we assume the Task screen loads without auth.
    await expect(page.getByText('Consult Task')).toBeVisible();
  });
});
