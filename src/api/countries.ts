import taxData from '../data/tax.data.json';
import type { CountriesData, Country } from '../types/taxes';
import { delay } from '../utils/delay';

const NETWORK_DELAY = 300;
const data = taxData as CountriesData;

export const getCountries = async (): Promise<Country[]> => {
  await delay(NETWORK_DELAY);
  return data.countries;
};
