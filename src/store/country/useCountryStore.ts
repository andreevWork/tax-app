import { create } from 'zustand';
import type { Country, CountryCode } from '../../types/taxes';
import type { CountryMetadata } from '../../data/countries';
import { getAvailableCountries, getCountryByCode } from '../../api/countries';

interface CountryState {
  availableCountries: CountryMetadata[];
  selectedCountry: Country | null;
  selectedCountryCode: CountryCode | null;
  isLoading: boolean;
  isLoadingCountry: boolean;
  error: string | null;

  fetchAvailableCountries: () => Promise<void>;
  selectCountry: (code: CountryCode) => Promise<void>;
}

export const useCountryStore = create<CountryState>((set, get) => ({
  availableCountries: [],
  selectedCountry: null,
  selectedCountryCode: null,
  isLoading: false,
  isLoadingCountry: false,
  error: null,

  fetchAvailableCountries: async () => {
    set({ isLoading: true, error: null });
    try {
      const countries = await getAvailableCountries();
      set({
        availableCountries: countries,
        isLoading: false,
      });

      // Auto-select first country (fire and forget)
      if (countries.length > 0) {
        void get().selectCountry(countries[0].code);
      }
    } catch {
      set({ error: 'Failed to load countries', isLoading: false });
    }
  },

  selectCountry: async (code: CountryCode) => {
    set({ isLoadingCountry: true, error: null, selectedCountryCode: code });
    try {
      const country = await getCountryByCode(code);
      set({
        selectedCountry: country,
        isLoadingCountry: false,
      });
    } catch {
      set({
        error: `Failed to load country: ${code}`,
        isLoadingCountry: false,
        selectedCountry: null,
      });
    }
  },
}));
