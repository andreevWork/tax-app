import { useEffect } from 'react';
import { useCountryStore } from '../../store';
import type { CountryCode } from '../../types/taxes';
import styles from './CaseSettings.module.css';

export function CaseSettings() {
  const {
    countries,
    selectedCountryCode,
    isLoading,
    fetchCountries,
    selectCountry,
  } = useCountryStore();

  useEffect(() => {
    void fetchCountries();
  }, [fetchCountries]);

  function handleCountryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    selectCountry(event.target.value as CountryCode);
  }

  return (
    <section className={styles.caseSettingsContainer}>
      <div className={styles.caseSettingsItem}>
        <label htmlFor="country-select">Country</label>
        <select
          id="country-select"
          value={selectedCountryCode ?? ''}
          onChange={handleCountryChange}
          disabled={isLoading}
        >
          {isLoading && <option>Loading...</option>}
          {countries.map((country) => (
            <option key={country.countryCode} value={country.countryCode}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.caseSettingsItem} />
      <div className={styles.caseSettingsItem} />
    </section>
  );
}
