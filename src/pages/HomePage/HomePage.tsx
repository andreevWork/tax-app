import { CaseSettings } from '../../components/CaseSettings/CaseSettings';
import { TaxChart } from '../../components/TaxChart/TaxChart';
import { useCountryStore } from '../../store';
import styles from './HomePage.module.css';

export function HomePage() {
  const selectedCountry = useCountryStore((state) => state.selectedCountry);

  return (
    <div className={styles.homePageWrapper}>
      <h1 data-testid="main-heading">Taxes Calculator</h1>
      <h2 data-testid="main-heading">
        Current country: {selectedCountry?.name ?? 'No country selected'}
      </h2>
      <CaseSettings />
      <TaxChart />
    </div>
  );
}
