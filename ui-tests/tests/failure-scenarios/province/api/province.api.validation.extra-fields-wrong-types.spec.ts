import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { createProvinceRaw } from '../../../../api/provinceClient';

// npx playwright test -g "should FAIL and include response body for analyzer evidence" --debug --headed --project=chromium


// Keep BASE_URL here for logging/grounding in the failure message.
// The actual request URL is handled inside provinceClient (which should also use API_BASE_URL env var).
const BASE_URL = process.env.API_BASE_URL ?? 'http://192.168.2.12:8080';

/**
 * Failure Scenario (API / Validation):
 * Real-world case: client sends an unexpected attribute that the API does not accept.
 *
 * Analyzer goal:
 * - Force a failing assertion AND embed the real API error payload into the Playwright error message.
 * - This gives your analyzer grounded evidence (status + JSON body + backend detail).
 *
 * Expected API behavior:
 * - 400 Bad Request with a payload similar to:
 *   { status, title, detail, userMessage, ... }
 *
 * Intentional test behavior:
 * - We EXPECT 201 to intentionally fail and generate rich failure data for the analyzer.
 */
test.describe('[FailureScenario][Province][API][Validation] Unexpected attribute (intentional fail)', () => {
  test('should FAIL and include response body for analyzer evidence', async () => {
    const token = await getAccessToken();

    // Payload aligned with the Postman example that returns 400:
    // - "unexpectedField" should trigger the backend validation error.
    const response = await createProvinceRaw(
      {
        name: 'Test mf',
        abbreviation: 'MF',
        unexpectedField: 'boom',
      } as any,
      { token }
    );

    // Capture the response body as text (works even if it's not valid JSON).
    const bodyText = await response.text();

    // Attach evidence to the report (optional but useful if you later parse attachments).
    await test.info().attach('api-response-body.json', {
      body: bodyText,
      contentType: 'application/json',
    });

    // Critical: embed the body into the assertion message so it shows up in errorMessage in Playwright JSON report.
    expect(
      response.status(),
      [
        'Intentional failure for analyzer.',
        `Request: POST ${BASE_URL}/v1/provinces`,
        `Actual status: ${response.status()}`,
        'Response body:',
        bodyText,
      ].join('\n')
    ).toBe(201);
  });
});
