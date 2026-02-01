import { useEffect } from 'react';
import { useCountryStore } from '../../store';
import type { CountryCode } from '../../domain/taxes';
import styles from './CaseSettings.module.css';

export function CaseSettings() {
  const { availableCountries, selectedCountryCode, isLoading, selectCountry } =
    useCountryStore();

  // Auto-select first country on mount
  useEffect(() => {
    if (!selectedCountryCode && availableCountries.length > 0) {
      void selectCountry(availableCountries[0].countryCode);
    }
  }, [selectedCountryCode, availableCountries, selectCountry]);

  function handleCountryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    void selectCountry(event.target.value as CountryCode);
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
          {availableCountries.map((country) => (
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
