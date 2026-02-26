import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { createProvinceRaw } from '../../../../api/provinceClient';

// npx playwright test -g "should FAIL and include response body when required field is missing" --debug --headed --project=chromium

// Keep BASE_URL here for logging/grounding in the failure message.
// The actual request URL is handled inside provinceClient (which should use API_BASE_URL env var).
const BASE_URL = process.env.API_BASE_URL ?? 'http://192.168.2.12:8080';

/**
 * Failure Scenario (API / Validation):
 * Real-world case: client sends LESS data than required (missing mandatory fields).
 *
 * Postman evidence (example):
 * - Request body: { "name": "Test mf" }
 * - Response: 400 with title "Invalid format" and detail "must not be blank"
 *
 * Analyzer goal:
 * - Force a failing assertion AND embed the real API error payload into the Playwright error message.
 * - This produces grounded evidence for "missing required field" / validation classification.
 *
 * Intentional test behavior:
 * - We EXPECT 201 to intentionally fail and generate rich failure data for the analyzer.
 */
test.describe('[FailureScenario][Province][API][Validation] Missing attribute (intentional fail)', () => {
  test('should FAIL and include response body when required field is missing', async () => {
    const token = await getAccessToken();

    // Missing required field on purpose (e.g., abbreviation).
    const response = await createProvinceRaw(
      {
        name: 'Test mf',
        // abbreviation is intentionally missing
      } as any,
      { token }
    );

    const bodyText = await response.text();

    // Attach evidence to the report (optional but useful if you later parse attachments).
    await test.info().attach('api-response-body.json', {
      body: bodyText,
      contentType: 'application/json',
    });

    // Embed the body into the assertion message so it shows up in errorMessage in Playwright JSON report.
    expect(
      response.status(),
      [
        'Intentional failure for analyzer.',
        'ANALYZER_TAG: VALIDATION_MISSING_REQUIRED_FIELD',
        `Request: POST ${BASE_URL}/v1/provinces`,
        `Actual status: ${response.status()}`,
        'Response body:',
        bodyText,
      ].join('\n')
    ).toBe(201);
  });
});
