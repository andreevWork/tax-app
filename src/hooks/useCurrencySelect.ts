import { useCurrencyStore } from '../store';
import { COUNTRIES } from '../constants/countries';
import { POPULAR_CURRENCIES } from '../constants/currency';

const APP_CURRENCIES = [
  ...new Set(Object.values(COUNTRIES).map((c) => c.currency)),
];

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

  const availableRates = rates ?? {};
  const currencies = [
    ...new Set([
      'EUR',
      baseCurrency,
      ...APP_CURRENCIES.filter((c) => c in availableRates),
      ...POPULAR_CURRENCIES.filter((c) => c in availableRates),
    ]),
  ].filter(Boolean);

  return {
    currencies,
    value: selectedCurrency,
    isLoading: isLoading || !rates,
    onChange: setSelectedCurrency,
  };
}
