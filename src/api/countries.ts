import taxData from '../data/tax.data.json';
import { validateCountriesData } from '../domain/taxes';
import type { Country } from '../types/taxes';
import { delay } from '../utils/delay';

const NETWORK_DELAY = 300;

export async function getCountries(): Promise<Country[]> {
  await delay(NETWORK_DELAY);
  const validated = validateCountriesData(taxData);
  return validated.countries as Country[];
}
