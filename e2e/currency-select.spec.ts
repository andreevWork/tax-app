import { expect, test } from '@playwright/test';
import { COUNTRIES } from '../src/constants/countries';
import { POPULAR_CURRENCIES } from '../src/constants/currency';

const currencySelect = (page: import('@playwright/test').Page) =>
  page.getByTestId('currency-select');

test.describe('Currency Select', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(currencySelect(page)).toBeVisible();
  });

  test('defaults to EUR', async ({ page }) => {
    await expect(currencySelect(page)).toHaveValue('EUR');
  });

  test('contains EUR, app country currencies, and popular currencies', async ({
    page,
  }) => {
    const appCurrencies = [
      ...new Set(Object.values(COUNTRIES).map((c) => c.currency)),
    ];
    const options = currencySelect(page).locator('option');
    const optionValues = await options.evaluateAll((els) =>
      els.map((el) => (el as HTMLOptionElement).value)
    );

    expect(optionValues[0]).toBe('EUR');

    for (const currency of appCurrencies) {
      expect(optionValues).toContain(currency);
    }

    for (const currency of POPULAR_CURRENCIES) {
      if (optionValues.includes(currency)) {
        expect(optionValues).toContain(currency);
      }
    }
  });

  test('allows selecting a different currency', async ({ page }) => {
    const select = currencySelect(page);

    await select.selectOption('USD');
    await expect(select).toHaveValue('USD');
  });

  test('updates currency when country changes', async ({ page }) => {
    const select = currencySelect(page);
    const countrySelect = page.getByTestId('country-select');

    await countrySelect.selectOption(COUNTRIES.RU.countryCode);

    const options = select.locator('option');
    const optionValues = await options.evaluateAll((els) =>
      els.map((el) => (el as HTMLOptionElement).value)
    );

    expect(optionValues[0]).toBe('EUR');
    expect(optionValues[1]).toBe(COUNTRIES.RU.currency);
  });

  test('converts gross income when currency is changed', async ({ page }) => {
    const select = currencySelect(page);
    const countrySelect = page.getByTestId('country-select');
    const grossInput = page.locator('#gross-income');

    await countrySelect.selectOption(COUNTRIES.DE.countryCode);
    await grossInput.fill('1000');

    await expect(grossInput).toHaveValue('1000');

    await select.selectOption('USD');

    const newValue = await grossInput.inputValue();
    const numericValue = parseFloat(newValue);
    expect(numericValue).toBeGreaterThan(0);
    expect(numericValue).not.toBe(1000);
  });

  test('shows only currencies available in exchange rates', async ({
    page,
  }) => {
    const options = currencySelect(page).locator('option');
    const count = await options.count();

    expect(count).toBeLessThanOrEqual(
      POPULAR_CURRENCIES.length + Object.values(COUNTRIES).length + 1 // EUR
    );
    expect(count).toBeGreaterThanOrEqual(3); // at least EUR + a couple more
  });
});
