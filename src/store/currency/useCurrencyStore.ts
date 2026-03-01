import { create } from 'zustand';
import { fetchExchangeRates } from '../../api/currency';

interface CurrencyState {
  baseCurrency: string;
  selectedCurrency: string;
  rates: Record<string, number> | null;
  isLoading: boolean;
  error: string | null;

  setBaseCurrency: (currency: string) => void;
  setSelectedCurrency: (currency: string) => void;
  fetchRates: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  baseCurrency: 'EUR',
  selectedCurrency: 'EUR',
  rates: null,
  isLoading: false,
  error: null,

  setBaseCurrency: (currency: string) => {
    set({ baseCurrency: currency });
  },

  setSelectedCurrency: (currency: string) => {
    set({ selectedCurrency: currency });
  },

  fetchRates: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchExchangeRates();
      set({
        rates: data.rates,
        isLoading: false,
      });
    } catch (err) {
      if (err instanceof Error) {
        set({ error: err.message, isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
}));
