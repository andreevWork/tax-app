import { loadCountryByCode } from '../data/countries';
import { validateCountry } from '../domain/taxes';
import type { CountryTaxConfig, CountryCode } from '../domain/taxes';
import { delay } from '../utils/delay';

const NETWORK_DELAY = 300;

/**
 * Load full country configuration by code.
 * Dynamically imports country data on demand.
 */
export async function getCountryByCode(
  code: CountryCode
): Promise<CountryTaxConfig> {
  await delay(NETWORK_DELAY);

  const countryData = await loadCountryByCode(code);
  const validated = validateCountry(countryData);

  return validated as CountryTaxConfig;
}
