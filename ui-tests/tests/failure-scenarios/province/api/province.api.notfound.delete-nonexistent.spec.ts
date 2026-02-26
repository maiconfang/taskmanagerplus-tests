import { test, expect, request } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';

const BASE_URL = process.env.API_BASE_URL ?? 'http://192.168.2.12:8080';

/**
 * Failure Scenario (API / NotFound):
 * Real-world case: a client tries to delete a resource that does not exist (stale UI / outdated cache / wrong ID).
 * This test intentionally expects 204 No Content and will FAIL with 404 (or similar).
 */
test.describe('[FailureScenario][Province][API][NotFound] Delete nonexistent', () => {
  test('should delete a nonexistent province (intentional failure)', async () => {
    const token = await getAccessToken();
    const context = await request.newContext();

    // Use a very large ID to reduce the chance of hitting a real record.
    const nonexistentId = 99999999;

    const response = await context.delete(BASE_URL+`/v1/provinces/${nonexistentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Intentional wrong expectation: API should return 404, but we expect 204 to create a failing test for the analyzer.
    expect(response.status()).toBe(204);
  });
});
