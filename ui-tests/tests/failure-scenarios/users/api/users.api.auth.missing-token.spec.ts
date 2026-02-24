import { test, expect } from '@playwright/test';
import { listUsersRaw } from '../../../../api/userClient';

/**
 * Failure Scenario (API / Auth):
 * Realistic user/system issue: missing Authorization token (expired session / misconfigured client).
 * This test intentionally expects success and will FAIL with 401/403 (or similar).
 */
test.describe('[FailureScenario][Users][API][Auth] Missing token', () => {
  test('should list users without token (intentional failure)', async () => {
    const response = await listUsersRaw(undefined);
    expect(response.status()).toBe(200); // intentional wrong expectation
  });
});
