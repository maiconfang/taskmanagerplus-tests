import { test, expect, request } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';

const BASE_URL = process.env.API_BASE_URL ?? 'http://192.168.2.12:8080';

/**
 * Failure Scenario (API / Validation):
 * Real-world case: a client sends a malformed JSON payload (serialization bug / proxy truncation / manual request).
 * This test intentionally expects success and will FAIL with 400 (or similar).
 */
test.describe('[FailureScenario][Province][API][Validation] Malformed JSON', () => {
  test('should create a province with malformed JSON (intentional failure)', async () => {
    const token = await getAccessToken();
    const context = await request.newContext();

    // Invalid JSON on purpose (missing closing brace).
    const malformedJson = '{ "name": "Bad JSON Province", "abbreviation": "BJ"';

    const response = await context.post(BASE_URL + '/v1/provinces', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Sending raw string to simulate a broken client.
      data: malformedJson,
    });

    // Intentional wrong expectation: API should return 400, but we expect 201 to create a failing test for the analyzer.
    expect(response.status()).toBe(201);
  });
});
