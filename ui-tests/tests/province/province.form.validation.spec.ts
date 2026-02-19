import { test, expect } from '@playwright/test';
import { ProvincePage } from '../../pages/ProvincePage';

test.describe('Province Form Validation', () => {
  test('should keep Save disabled until required fields are filled', async ({ page }) => {
    const provincePage = new ProvincePage(page);

    await provincePage.goto();
    await provincePage.goToCreate();

    // Most apps disable Save when required fields are empty.
    await expect(provincePage.crud.saveButton).toBeVisible();
    await expect(provincePage.crud.saveButton).toBeDisabled();

    // Fill only the name -> still disabled (abbreviation missing)
    await provincePage.nameInput.fill(`Province ${Date.now()}`);
    await expect(provincePage.crud.saveButton).toBeDisabled();

    // Fill abbreviation -> enabled
    await provincePage.abbreviationInput.fill('PV');
    await expect(provincePage.crud.saveButton).toBeEnabled();
  });
});
