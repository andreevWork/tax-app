import { useEffect } from 'react';
import { useCountryStore } from '../../store';
import type { CountryCode } from '../../types/taxes';
import styles from './CaseSettings.module.css';

export function CaseSettings() {
  const {
    availableCountries,
    selectedCountryCode,
    isLoading,
    isLoadingCountry,
    fetchAvailableCountries,
    selectCountry,
  } = useCountryStore();

  useEffect(() => {
    void fetchAvailableCountries();
  }, [fetchAvailableCountries]);

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
          disabled={isLoading || isLoadingCountry}
        >
          {isLoading && <option>Loading...</option>}
          {availableCountries.map((country) => (
            <option key={country.code} value={country.code}>
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
