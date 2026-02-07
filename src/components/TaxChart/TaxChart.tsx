import { useCountryStore, useTaxResultStore } from '../../store';
import styles from './TaxChart.module.css';

export function TaxChart() {
  const selectedCountry = useCountryStore((state) => state.selectedCountry);
  const { result, isCalculated } = useTaxResultStore();

  if (!isCalculated || !result) {
    return (
      <section className={styles.taxChartContainer}>
        <p className={styles.emptyState}>
          Configure your inputs and click Calculate to see results
        </p>
      </section>
    );
  }

  const currency = selectedCountry?.currency || '';
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <section className={styles.taxChartContainer}>
      <h2 className={styles.title}>Tax Calculation Results</h2>

      <div className={styles.resultSection}>
        <h3>Deductions</h3>
        <ul className={styles.resultList}>
          <li>
            <span>Personal Deduction:</span>
            <span>{formatCurrency(result.deductions.personal)}</span>
          </li>
          <li>
            <span>Children Deduction:</span>
            <span>{formatCurrency(result.deductions.children)}</span>
          </li>
          <li className={styles.highlighted}>
            <span>Total Deductions:</span>
            <span>{formatCurrency(result.deductions.totalDeductions)}</span>
          </li>
        </ul>
      </div>

      <div className={styles.resultSection}>
        <h3>Taxes</h3>
        <ul className={styles.resultList}>
          <li>
            <span>Taxable Income:</span>
            <span>{formatCurrency(result.taxes.taxableIncome)}</span>
          </li>
          <li>
            <span>Income Tax:</span>
            <span>{formatCurrency(result.taxes.incomeTax)}</span>
          </li>
          <li>
            <span>Consumption Tax:</span>
            <span>{formatCurrency(result.taxes.consumptionTax)}</span>
          </li>
          <li className={styles.highlighted}>
            <span>Total Tax:</span>
            <span>{formatCurrency(result.taxes.totalTax)}</span>
          </li>
        </ul>
      </div>

      <div className={styles.resultSection}>
        <h3>Totals</h3>
        <ul className={styles.resultList}>
          <li>
            <span>Gross Income:</span>
            <span>{formatCurrency(result.totals.grossIncome)}</span>
          </li>
          <li>
            <span>Net Income:</span>
            <span>{formatCurrency(result.totals.netIncome)}</span>
          </li>
          <li className={styles.highlighted}>
            <span>Effective Tax Rate:</span>
            <span>{formatPercent(result.totals.effectiveTaxRate)}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
