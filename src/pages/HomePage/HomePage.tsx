import { CaseSettings } from '../../components/CaseSettings/CaseSettings';
import { TaxChart } from '../../components/TaxChart/TaxChart';
import { useTaxChart } from '../../hooks/useTaxChart';
import { useCountryStore } from '../../store';
import shared from '../../styles/shared.module.css';
import styles from './HomePage.module.css';

export function HomePage() {
  const selectedCountry = useCountryStore((state) => state.selectedCountry);
  const taxChartProps = useTaxChart();

  return (
    <div className={styles.homePageWrapper}>
      <h1 data-testid="main-heading" className={shared.visuallyHidden}>
        Tax Calculator
      </h1>
      <h2 className={shared.textCenter}>
        Current country: {selectedCountry?.name ?? 'No country selected'}
      </h2>
      <CaseSettings />
      <TaxChart {...taxChartProps} />
    </div>
  );
}
