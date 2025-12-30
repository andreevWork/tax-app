import { create } from 'zustand';
import type { Country, CountryCode } from '../../types/taxes';
import { getCountries } from '../../api/countries';

interface CountryState {
  countries: Country[];
  selectedCountryCode: CountryCode | null;
  isLoading: boolean;
  error: string | null;

  fetchCountries: () => Promise<void>;
  selectCountry: (code: CountryCode) => void;
  getSelectedCountry: () => Country | undefined;
}

export const useCountryStore = create<CountryState>((set, get) => ({
  countries: [],
  selectedCountryCode: null,
  isLoading: false,
  error: null,

  fetchCountries: async () => {
    set({ isLoading: true, error: null });
    try {
      const countries = await getCountries();
      set({
        countries,
        isLoading: false,
        selectedCountryCode: countries[0]?.countryCode ?? null,
      });
    } catch {
      set({ error: 'Failed to load countries', isLoading: false });
    }
  },

  selectCountry: (code: CountryCode) => {
    set({ selectedCountryCode: code });
  },

  getSelectedCountry: () => {
    const { countries, selectedCountryCode } = get();
    return countries.find((c) => c.countryCode === selectedCountryCode);
  },
}));
