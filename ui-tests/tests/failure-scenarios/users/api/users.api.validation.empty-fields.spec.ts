import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { createUserRaw } from '../../../../api/userClient';

/**
 * Failure Scenario (API / Validation):
 * Realistic user/system issue: invalid payload reaches the API (client bug / bypassed UI validation).
 * This test intentionally expects success and will FAIL with 400 (or similar).
 */
test.describe('[FailureScenario][Users][API][Validation] Empty required fields', () => {
  test('should create a user with empty fields (intentional failure)', async () => {
    const token = await getAccessToken();

    const response = await createUserRaw(
      { name: '', email: '', password: '' },
      { token }
    );

    expect(response.status()).toBe(201); // intentional wrong expectation
  });
});
