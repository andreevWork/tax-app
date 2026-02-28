import styles from './CurrencySelect.module.css';

interface CurrencySelectProps {
  currencies: string[];
  value: string;
  onChange: (currencyCode: string) => void;
  isLoading: boolean;
}

export function CurrencySelect({
  currencies,
  value,
  onChange,
  isLoading,
}: CurrencySelectProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div
        className={`${styles.select} ${styles.skeleton}`}
        aria-hidden="true"
      />
    );
  }

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    onChange(event.target.value);
  }

  return (
    <select
      className={styles.select}
      value={value}
      onChange={handleChange}
      aria-label="Select display currency"
      name="currency-select"
    >
      {currencies.map((currencyCode) => (
        <option key={currencyCode} value={currencyCode}>
          {currencyCode}
        </option>
      ))}
    </select>
  );
}
