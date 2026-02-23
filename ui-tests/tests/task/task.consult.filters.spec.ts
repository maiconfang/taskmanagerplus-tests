// npx playwright test -g "should delete a province via UI and validate removal" --debug --headed --project=chromium
// npx playwright test tests/task/task.consult.filters.spec.ts --project=chromium
// npx playwright test -g "should filter by completed tasks" --debug --headed --project=chromium
// npx playwright test -g "should filter by completed tasks - seeded via API" --debug --headed --project=chromium


import { test } from '@playwright/test';
import { TaskPage } from '../../pages/TaskPage';
import { TaskApiClient } from '../../api/taskApiClient';

test.describe('Task Consult - Filters', () => {
  test('should consult and show at least one task', async ({ page }) => {
    const taskPage = new TaskPage(page);

    await taskPage.gotoSearch();
    await taskPage.clearFilters();
    await taskPage.consult();

    await taskPage.expectAtLeastOneResult();
  });

  test('should filter by task title', async ({ page }) => {
    const taskPage = new TaskPage(page);

    await taskPage.gotoSearch();
    await taskPage.clearFilters();

    await taskPage.filterByTitle('Task 3');
    await taskPage.consult();

    await taskPage.expectTaskInTable('Task 3');
  });

  test('should show no content for an unknown task title', async ({ page }) => {
    const taskPage = new TaskPage(page);

    await taskPage.gotoSearch();
    await taskPage.clearFilters();

    await taskPage.filterByTitle('This Task Should Not Exist 999999');
    await taskPage.consult();

    await taskPage.expectNoContent();
  });

  // test('should filter by completed tasks', async ({ page }) => {
  //   const taskPage = new TaskPage(page);

  //   await taskPage.gotoSearch();
  //   await taskPage.clearFilters();

  //   await taskPage.setCompletedFilter(true);
  //   await taskPage.consult();

  //   await taskPage.expectAllRowsCompletedValue('Yes');
  // });

  test('should filter by completed tasks - seeded via API', async ({ page }) => {
    const taskPage = new TaskPage(page);
    const api = new TaskApiClient();

    // Generate a unique suffix to avoid collisions in parallel or repeated runs
    const unique = Date.now();

    // Create a deterministic task via API to guarantee test stability
    const created = await api.createTask({
      title: `Task Completed Auto ${unique}`,
      description: `Description Auto ${unique}`,
      dueDate: '2024-06-30', // API requires YYYY-MM-DD format
      completed: true,
    });

    try {
    await taskPage.gotoSearch();
    await taskPage.clearFilters();

    // Select Completed filter (this is what we want to test)
    await taskPage.setCompletedFilter(true);

    await taskPage.consult();

    // Validate the specific task we created is visible
    await taskPage.expectTaskInTable(created.title);

    // Validate all returned rows are completed
    await taskPage.expectAllRowsCompletedValue('Yes');
    } finally {
      // Cleanup to keep the environment consistent even if the test fails
      await api.deleteTask(created.id);
    }
  });


});
