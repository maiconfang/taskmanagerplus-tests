import { test, expect } from '@playwright/test';
import { listTasksRaw } from '../../../../api/taskClient';

/**
 * Failure Scenario (Task / API / Auth):
 * Real-world situation: the client calls the API without a Bearer token (expired session / missing auth).
 * This test intentionally expects 200 OK and will FAIL with 401/403.
 */
test.describe('[FailureScenario][Task][API][Auth] Missing token', () => {
  test('should list tasks without auth (intentional failure)', async () => {
    const response = await listTasksRaw(); // no token
    expect(response.status()).toBe(200); // intentional wrong expectation
  });
});
