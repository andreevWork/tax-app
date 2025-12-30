import { useCountryStore } from '../../store';
import styles from './TaxChart.module.css';

export function TaxChart() {
  const selectedCountry = useCountryStore((state) =>
    state.getSelectedCountry()
  );

  return (
    <section className={styles.taxChartContainer}>
      <h2>{selectedCountry?.name ?? 'Select a country'}</h2>
      <div className={styles.chartCircle} />
    </section>
  );
}
