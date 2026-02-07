import { create } from 'zustand';
import type { TaxesResult } from '../../domain/taxes';

interface TaxResultState {
  result: TaxesResult | null;
  isCalculated: boolean;
  setResult: (result: TaxesResult) => void;
  clearResult: () => void;
}

export const useTaxResultStore = create<TaxResultState>((set) => ({
  result: null,
  isCalculated: false,

  setResult: (result) => {
    set({ result, isCalculated: true });
  },

  clearResult: () => {
    set({ result: null, isCalculated: false });
  },
}));
