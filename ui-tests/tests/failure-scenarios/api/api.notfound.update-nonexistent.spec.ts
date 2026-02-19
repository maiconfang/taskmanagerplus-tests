import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../api/authClient';
import { updateProvinceRaw } from '../../../api/provinceClient';

/**
 * Failure Scenario (API / Not Found):
 * Realistic situation: UI tries to update a record that was deleted by another user/process.
 * The API should respond 404 (or similar). This test intentionally expects 200 and will FAIL.
 */
test.describe('[FailureScenario][API][NotFound] Update deleted/non-existing record', () => {
  test('should update a non-existing province id (intentional failure)', async () => {
    const token = await getAccessToken();

    const nonExistingId = 99999999;
    const response = await updateProvinceRaw(nonExistingId, { name: 'X', abbreviation: 'XX' }, token);

    expect(response.status()).toBe(200); // intentional wrong expectation
  });
});
