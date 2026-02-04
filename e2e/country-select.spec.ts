import { expect, test } from '@playwright/test';
import { COUNTRIES } from '../src/constants/countries';

test.describe('Country Select', () => {
  test('allows selecting a country', async ({ page }) => {
    await page.goto('/');

    const countrySelect = page.getByTestId('country-select');
    const germany = COUNTRIES.DE;

    await countrySelect.selectOption(germany.countryCode);
    await expect(countrySelect).toHaveValue(germany.countryCode);
  });

  test('handles onChange by updating selected country details', async ({
    page,
  }) => {
    await page.goto('/');

    const headerCountrySelect = page.getByTestId('country-select');
    const countryHeading = page.getByRole('heading', { level: 2 });
    const germany = COUNTRIES.DE;

    await expect(countryHeading).toHaveText('Select a country');

    await headerCountrySelect.selectOption(germany.countryCode);

    await expect(headerCountrySelect).toHaveValue(germany.countryCode);
    await expect(countryHeading).toHaveText(germany.name);
  });

  test('shows flags and names in country options', async ({ page }) => {
    await page.goto('/');

    const countrySelect = page.getByTestId('country-select');
    await expect(countrySelect).toBeVisible();

    const countries = Object.values(COUNTRIES);

    const options = countrySelect.locator('option');
    await expect(options).toHaveCount(countries.length);

    for (const country of countries) {
      const option = countrySelect.locator(
        `option[value="${country.countryCode}"]`
      );
      await expect(option).toHaveText(`${country.flag} ${country.name}`);
    }
  });
});
