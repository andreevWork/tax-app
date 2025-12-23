import { CaseSettings } from '../../components/caseSettings/CaseSettings';
import { TaxChart } from '../../components/TaxChart/TaxChart';
import styles from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className={styles.homePageWrapper}>
      <h1 data-testid="main-heading">Taxes App</h1>
      <CaseSettings />
      <TaxChart />
    </div>
  );
};
