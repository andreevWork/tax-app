import type {
  CountryCode,
  CountryName,
  CountryCurrency,
} from '../../types/taxes';

export interface CountryMetadata {
  code: CountryCode;
  name: CountryName;
  currency: CountryCurrency;
}

export const AVAILABLE_COUNTRIES: CountryMetadata[] = [
  { code: 'RU', name: 'Russia', currency: 'RUB' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'RS', name: 'Serbia', currency: 'RSD' },
];
