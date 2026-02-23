import { test } from '@playwright/test';
import { TaskPage } from '../../pages/TaskPage';

test.describe('Task Navigation', () => {
  test('should load task consult screen', async ({ page }) => {
    const taskPage = new TaskPage(page);

    await taskPage.gotoSearch();
    await taskPage.expectSearchLoaded();
  });
});
