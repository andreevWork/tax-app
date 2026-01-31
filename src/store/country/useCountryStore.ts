import { create } from 'zustand';
import type { CountryTaxConfig, CountryCode } from '../../domain/taxes';
import {
  AVAILABLE_COUNTRIES,
  type CountryMetadata,
} from '../../data/countries';
import { getCountryByCode } from '../../api/countries';

interface CountryState {
  availableCountries: CountryMetadata[];
  selectedCountry: CountryTaxConfig | null;
  selectedCountryCode: CountryCode | null;
  isLoading: boolean;
  error: string | null;

  selectCountry: (code: CountryCode) => Promise<void>;
}

export const useCountryStore = create<CountryState>((set) => ({
  availableCountries: AVAILABLE_COUNTRIES,
  selectedCountry: null,
  selectedCountryCode: null,
  isLoading: false,
  error: null,

  selectCountry: async (code: CountryCode) => {
    set({ isLoading: true, error: null, selectedCountryCode: code });
    try {
      const country = await getCountryByCode(code);
      set({
        selectedCountry: country,
        isLoading: false,
      });
    } catch {
      set({
        error: `Failed to load country: ${code}`,
        isLoading: false,
        selectedCountry: null,
      });
    }
  },
}));
