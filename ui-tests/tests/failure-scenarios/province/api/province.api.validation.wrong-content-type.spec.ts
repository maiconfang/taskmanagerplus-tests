import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { createProvinceRaw } from '../../../../api/provinceClient';

/**
 * Failure Scenario (API / Validation):
 * Real-world case: the client sends the correct data but uses the wrong Content-Type (client misconfiguration).
 * This test intentionally expects success and will FAIL with 415/400 (or similar).
 */
test.describe('[FailureScenario][Province][API][Validation] Wrong Content-Type', () => {
  test('should create a province with text/plain content-type (intentional failure)', async () => {
    const token = await getAccessToken();

    const response = await createProvinceRaw(
      { name: 'Wrong Content-Type Province', abbreviation: 'WC' },
      { token, contentType: 'text/plain' }
    );

    // Intentional wrong expectation: API should return 415/400, but we expect 201 to create a failing test for the analyzer.
    expect(response.status()).toBe(201);
  });
});
