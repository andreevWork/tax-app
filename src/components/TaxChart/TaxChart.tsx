import type { TaxesResult } from '../../domain/taxes';
import shared from '../../styles/shared.module.css';
import { ResultRow } from './ResultRow';
import styles from './TaxChart.module.css';

interface TaxChartProps {
  result: TaxesResult | null;
  isCalculated: boolean;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
}

export function TaxChart({
  result,
  isCalculated,
  formatCurrency,
  formatPercent,
}: TaxChartProps): React.JSX.Element {
  if (!isCalculated || !result) {
    return (
      <section className={styles.taxChartContainer} aria-label="Tax results">
        <p className={shared.emptyState}>
          Configure your inputs and click Calculate to see results
        </p>
      </section>
    );
  }

  return (
    <section className={styles.taxChartContainer} aria-label="Tax results">
      <h2 className={styles.title}>Tax Calculation Results</h2>

      <div className={styles.resultSection}>
        <h3>Deductions</h3>
        <ul className={styles.resultList}>
          <ResultRow
            label="Personal Deduction:"
            value={formatCurrency(result.deductions.personal)}
          />
          <ResultRow
            label="Children Deduction:"
            value={formatCurrency(result.deductions.children)}
          />
          <ResultRow
            label="Total Deductions:"
            value={formatCurrency(result.deductions.totalDeductions)}
            highlighted
          />
        </ul>
      </div>

      <div className={styles.resultSection}>
        <h3>Taxes</h3>
        <ul className={styles.resultList}>
          <ResultRow
            label="Taxable Income:"
            value={formatCurrency(result.taxes.taxableIncome)}
          />
          <ResultRow
            label="Income Tax:"
            value={formatCurrency(result.taxes.incomeTax)}
          />
          <ResultRow
            label="Consumption Tax:"
            value={formatCurrency(result.taxes.consumptionTax)}
          />
          <ResultRow
            label="Total Tax:"
            value={formatCurrency(result.taxes.totalTax)}
            highlighted
          />
        </ul>
      </div>

      <div className={styles.resultSection}>
        <h3>Totals</h3>
        <ul className={styles.resultList}>
          <ResultRow
            label="Gross Income:"
            value={formatCurrency(result.totals.grossIncome)}
          />
          <ResultRow
            label="Net Income:"
            value={formatCurrency(result.totals.netIncome)}
          />
          <ResultRow
            label="Effective Tax Rate:"
            value={formatPercent(result.totals.effectiveTaxRate)}
            highlighted
          />
        </ul>
      </div>
    </section>
  );
}
