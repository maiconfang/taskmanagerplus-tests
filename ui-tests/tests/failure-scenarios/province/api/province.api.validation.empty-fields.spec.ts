import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { createProvinceRaw } from '../../../../api/provinceClient';

/**
 * Failure Scenario (API / Validation):
 * Realistic user/system issue: invalid payload reaches the API (client bug / bypassed UI validation).
 * This test intentionally expects success and will FAIL with 400 (or similar).
 */
test.describe('[FailureScenario][Province][API][Validation] Invalid payload', () => {
  test('should create a province with empty fields (intentional failure)', async () => {
    const token = await getAccessToken();

    const response = await createProvinceRaw({ name: '', abbreviation: '' }, { token });
    expect(response.status()).toBe(201); // intentional wrong expectation
  });
});
