import { expect, test } from '@playwright/test';

test.describe('App', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');

    const heading = page.getByTestId('main-heading');
    await expect(heading).toBeVisible();
  });
});
