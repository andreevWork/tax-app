import type { CountryMetadata } from '../../data/countries';
import type { CountryCode } from '../../domain/taxes';
import styles from './CountrySelect.module.css';

interface CountrySelectProps {
  countries: CountryMetadata[];
  value: CountryCode | null;
  onChange: (code: CountryCode) => void;
}

export function CountrySelect({
  countries,
  value,
  onChange,
}: CountrySelectProps): React.JSX.Element {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    onChange(event.target.value as CountryCode);
  }

  return (
    <select
      className={styles.select}
      value={value ?? ''}
      onChange={handleChange}
      data-testid="country-select"
      aria-label="Select country"
    >
      {value === null && (
        <option value="" disabled>
          Select country
        </option>
      )}
      {countries.map((country) => (
        <option key={country.countryCode} value={country.countryCode}>
          {country.flag} {country.name}
        </option>
      ))}
    </select>
  );
}
