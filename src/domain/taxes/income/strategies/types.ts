import type { CalculatorInput } from '../../types';
import type { DeductionsResult } from '../../deductions/types';
import type { CountryCode } from '../../types';
import type { IncomeTaxType } from '../types';

// T is the strategy's narrow config type. For non-unique strategies T is
// Extract<IncomeTax, { type: 'progressive' | 'flat' }>; for unique strategies T
// is a country-specific interface declared next to the strategy.
export interface IncomeTaxStrategy<T = unknown> {
  readonly type: IncomeTaxType;
  // Required when type === 'unique'. Selects this strategy for one specific country.
  readonly countryCode?: CountryCode;
  calculate(
    input: CalculatorInput,
    deductions: DeductionsResult,
    taxConfig: T
  ): number;
}
