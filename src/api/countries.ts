import { AVAILABLE_COUNTRIES, loadCountryByCode } from '../data/countries';
import type { CountryMetadata } from '../data/countries';
import { validateCountry } from '../domain/taxes';
import type { Country, CountryCode } from '../types/taxes';
import { delay } from '../utils/delay';

const NETWORK_DELAY = 300;

/**
 * Get list of available countries (metadata only).
 * Fast operation - only returns basic info for the select.
 */
export async function getAvailableCountries(): Promise<CountryMetadata[]> {
  await delay(NETWORK_DELAY);
  return AVAILABLE_COUNTRIES;
}

/**
 * Load full country configuration by code.
 * Dynamically imports country data on demand.
 */
export async function getCountryByCode(code: CountryCode): Promise<Country> {
  await delay(NETWORK_DELAY);

  const countryData = await loadCountryByCode(code);
  const validated = validateCountry(countryData);

  return validated as Country;
}
