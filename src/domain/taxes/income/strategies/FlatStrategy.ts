import type { CalculatorInput } from '../../types';
import type { DeductionsResult } from '../../deductions/types';
import type { IncomeTax } from '../types';
import type { IncomeTaxStrategy } from './types';

export class FlatStrategy
  implements IncomeTaxStrategy<Extract<IncomeTax, { type: 'flat' }>>
{
  readonly type = 'flat' as const;

  calculate(
    input: CalculatorInput,
    deductions: DeductionsResult,
    taxConfig: Extract<IncomeTax, { type: 'flat' }>
  ): number {
    const taxableIncome = Math.max(0, input.gross - deductions.totalDeductions);
    const rate = taxConfig.brackets.at(0)?.rate ?? 0;
    return taxableIncome * rate;
  }
}
