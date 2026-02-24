import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { createUserRaw } from '../../../../api/userClient';

/**
 * Failure Scenario (API / Validation):
 * Realistic user/system issue: client sends an invalid email format.
 * This test intentionally expects success and will FAIL with 400 (or similar).
 */
test.describe('[FailureScenario][Users][API][Validation] Invalid email format', () => {
  test('should create a user with invalid email (intentional failure)', async () => {
    const token = await getAccessToken();

    const response = await createUserRaw(
      {
        name: 'Invalid Email User',
        email: 'invalid-email-format',
        password: '123',
      },
      { token }
    );

    expect(response.status()).toBe(201); // intentional wrong expectation
  });
});
