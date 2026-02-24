import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { updateUserRaw } from '../../../../api/userClient';

/**
 * Failure Scenario (API / NotFound):
 * Realistic user/system issue: client attempts to update a record that does not exist (stale UI / wrong id).
 * This test intentionally expects success and will FAIL with 404 (or similar).
 */
test.describe('[FailureScenario][Users][API][NotFound] Update non-existent user', () => {
  test('should update a non-existent user id (intentional failure)', async () => {
    const token = await getAccessToken();
    const nonExistentId = 999999;

    const response = await updateUserRaw(
      nonExistentId,
      { id: nonExistentId, name: 'Ghost User', email: 'ghost@taskmanagerplus.com' },
      token
    );

    expect(response.status()).toBe(200); // intentional wrong expectation
  });
});
