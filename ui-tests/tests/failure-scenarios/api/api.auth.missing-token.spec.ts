import { test, expect } from '@playwright/test';
import { listProvincesRaw } from '../../../api/provinceClient';

/**
 * Failure Scenario (API / Auth):
 * A common real-world failure: calling the API without a Bearer token (expired session / missing auth).
 * This test intentionally expects 200 OK and will FAIL with 401/403.
 */
test.describe('[FailureScenario][API][Auth] Missing token', () => {
  test('should list provinces without auth (intentional failure)', async () => {
    const response = await listProvincesRaw(); // no token
    expect(response.status()).toBe(200); // intentional wrong expectation
  });
});
