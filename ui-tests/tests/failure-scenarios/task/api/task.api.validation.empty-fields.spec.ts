import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { createTaskRaw } from '../../../../api/taskClient';

/**
 * Failure Scenario (Task / API / Validation):
 * Real-world issue: invalid payload reaches the API (client bug / bypassed UI validation).
 * This test intentionally expects success and will FAIL with 400 (or similar).
 */
test.describe('[FailureScenario][Task][API][Validation] Invalid payload', () => {
  test('should create a task with empty required fields (intentional failure)', async () => {
    const token = await getAccessToken();

    const response = await createTaskRaw(
      { title: '', description: '', dueDate: '', completed: true },
      { token }
    );

    expect(response.status()).toBe(201); // intentional wrong expectation
  });
});
