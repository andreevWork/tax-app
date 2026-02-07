import type { CountryCode } from '../../domain/taxes';
import { useCountryStore } from '../../store/country/useCountryStore';
import { CountrySelect } from '../CountrySelect/CountrySelect';
import styles from './GlobalSettings.module.css';

export function GlobalSettings(): React.JSX.Element {
  const {
    availableCountries,
    selectedCountry,
    selectedCountryCode,
    selectCountry,
  } = useCountryStore();

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
      <div className={`${styles.navItem} ${styles.currency}`}>
        {selectedCountry?.currency || 'Currency'}
      </div>
      <div className={`${styles.navItem} ${styles.item80}`} />
    </nav>
  );
}
