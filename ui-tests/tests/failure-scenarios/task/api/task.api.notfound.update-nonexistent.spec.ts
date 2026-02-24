import { test, expect } from '@playwright/test';
import { getAccessToken } from '../../../../api/authClient';
import { updateTaskRaw } from '../../../../api/taskClient';

/**
 * Failure Scenario (Task / API / NotFound):
 * Real-world situation: UI tries to update a record that was deleted by another user/process.
 * The API should respond 404 (or similar). This test intentionally expects 200 and will FAIL.
 */
test.describe('[FailureScenario][Task][API][NotFound] Update deleted/non-existing record', () => {
  test('should update a non-existing task id (intentional failure)', async () => {
    const token = await getAccessToken();

    const nonExistingId = 99999999;
    const response = await updateTaskRaw(
      nonExistingId,
      { title: 'X', description: 'Y', dueDate: '2024-06-30', completed: true },
      token
    );

    expect(response.status()).toBe(200); // intentional wrong expectation
  });
});
