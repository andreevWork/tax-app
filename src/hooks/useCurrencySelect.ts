import { useCurrencyStore } from '../store';

interface CurrencySelectData {
  currencies: string[];
  value: string;
  isLoading: boolean;
  onChange: (currencyCode: string) => void;
}

export function useCurrencySelect(): CurrencySelectData {
  const {
    baseCurrency,
    selectedCurrency,
    rates,
    isLoading,
    setSelectedCurrency,
  } = useCurrencyStore();

  const availableCurrencies = rates ? Object.keys(rates) : [];
  const currencies = [
    ...new Set(['EUR', baseCurrency, ...availableCurrencies]),
  ].filter(Boolean);

  return {
    currencies,
    value: selectedCurrency,
    isLoading: isLoading || !rates,
    onChange: setSelectedCurrency,
  };
}
