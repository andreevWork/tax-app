import { COUNTRIES } from '../../constants/countries';
import type { CountryTaxConfig, CountryCode } from '../../domain/taxes';

// Generate available countries list from COUNTRIES constant
export const AVAILABLE_COUNTRIES = Object.values(COUNTRIES);

// Type for country metadata (used in UI selectors)
export type CountryMetadata = (typeof AVAILABLE_COUNTRIES)[number];

const countryFileMap: Record<CountryCode, string> = {
  RU: 'russia',
  DE: 'germany',
  RS: 'serbia',
};

/**
 * Vite glob import - explicitly tells bundler which files can be loaded.
 * This creates optimized chunks for each country file.
 */
const countryModules = import.meta.glob<{ default: CountryTaxConfig }>(
  './*.json'
);

/**
 * Dynamically loads country configuration by country code.
 * Scalable solution - just add new entries to countryFileMap.
 *
 * @param code - Country code (e.g., 'RU', 'DE', 'RS')
 * @returns Promise with country configuration
 * @throws Error if country code is unknown or file loading fails
 */
export async function loadCountryByCode(
  code: CountryCode
): Promise<CountryTaxConfig> {
  const fileName = countryFileMap[code];

  if (!fileName) {
    throw new Error(`Unknown country code: ${code}`);
  }

  const modulePath = `./${fileName}.json`;
  const loader = countryModules[modulePath];

  try {
    const module = await loader();
    return module.default;
  } catch (error) {
    throw new Error(`Failed to load country data for code: ${code}`, {
      cause: error,
    });
  }
}
