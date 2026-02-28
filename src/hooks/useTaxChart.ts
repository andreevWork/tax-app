import { useTaxResultStore, useCurrencyStore } from '../store';
import { convertCurrency } from '../utils/currencyConversion';
import type { TaxesResult } from '../domain/taxes';

interface TaxChartData {
  result: TaxesResult | null;
  isCalculated: boolean;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
}

export function useTaxChart(): TaxChartData {
  const { result, isCalculated } = useTaxResultStore();
  const { baseCurrency, selectedCurrency, rates } = useCurrencyStore();

  function formatCurrency(value: number): string {
    const convertedValue = convertCurrency(
      value,
      baseCurrency,
      selectedCurrency,
      rates
    );

    return `${convertedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${selectedCurrency}`;
  }

  function formatPercent(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }

  return {
    result,
    isCalculated,
    formatCurrency,
    formatPercent,
  };
}
