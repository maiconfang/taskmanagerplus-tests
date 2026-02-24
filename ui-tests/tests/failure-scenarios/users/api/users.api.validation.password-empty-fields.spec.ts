import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { changeUserPasswordRaw } from '../../../../api/userClient';

/**
 * Failure Scenario (API / Validation):
 * Realistic user/system issue: client sends invalid password change payload.
 * This test intentionally expects success and will FAIL with 400 (or 422) depending on the backend.
 */
test.describe('[FailureScenario][Users][API][Validation] Change password with empty fields', () => {
  test('should change password with empty current/new password (intentional failure)', async () => {
    const token = await getAccessToken();
    const userId = 5; // Use any existing user id in your environment

    const response = await changeUserPasswordRaw(
      userId,
      { currentPassword: '', newPassword: '' },
      token
    );

    expect(response.status()).toBe(200); // intentional wrong expectation
  });
});
