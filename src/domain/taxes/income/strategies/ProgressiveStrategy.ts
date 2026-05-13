import type { CalculatorInput } from '../../types';
import type { DeductionsResult } from '../../deductions/types';
import type { IncomeTax } from '../types';
import type { IncomeTaxStrategy } from './types';
import { applyBrackets } from './applyBrackets';

export class ProgressiveStrategy
  implements IncomeTaxStrategy<Extract<IncomeTax, { type: 'progressive' }>>
{
  readonly type = 'progressive' as const;

  calculate(
    input: CalculatorInput,
    deductions: DeductionsResult,
    taxConfig: Extract<IncomeTax, { type: 'progressive' }>
  ): number {
    const taxableIncome = Math.max(0, input.gross - deductions.totalDeductions);
    return applyBrackets(taxableIncome, taxConfig.brackets);
  }
}
