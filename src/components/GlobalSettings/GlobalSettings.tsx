import { useEffect } from 'react';
import type { CountryCode } from '../../domain/taxes';
import { useCountryStore } from '../../store/country/useCountryStore';
import { useCurrencyStore } from '../../store/currency/useCurrencyStore';
import { CountrySelect } from '../CountrySelect/CountrySelect';
import { CurrencySelect } from '../CurrencySelect/CurrencySelect';
import { useCurrencySelect } from '../../hooks/useCurrencySelect';
import styles from './GlobalSettings.module.css';

export function GlobalSettings(): React.JSX.Element {
  const {
    availableCountries,
    selectedCountry,
    selectedCountryCode,
    selectCountry,
  } = useCountryStore();

  const { setBaseCurrency, fetchRates } = useCurrencyStore();
  const currencySelectProps = useCurrencySelect();

  useEffect(() => {
    if (selectedCountry?.currency) {
      setBaseCurrency(selectedCountry.currency);
    }
  }, [selectedCountry, setBaseCurrency]);

  useEffect(() => {
    void fetchRates();
  }, [fetchRates]);

  function handleCountryChange(code: CountryCode): void {
    void selectCountry(code);
  }

  return (
    <nav className={styles.headerNavContainer}>
      <CountrySelect
        countries={availableCountries}
        value={selectedCountryCode}
        onChange={handleCountryChange}
      />
      <CurrencySelect {...currencySelectProps} />
    </nav>
  );
}
