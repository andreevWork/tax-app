import type { CalculatorInput } from '../../types';
import type { DeductionsResult } from '../../deductions/types';
import type { IncomeTax } from '../types';
import type { IncomeTaxStrategy } from './types';

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
    let rest = taxableIncome;
    let tax = 0;
    let prevMax = 0;

    for (const bracket of taxConfig.brackets) {
      const currentMax = bracket.max ?? Infinity;
      const span = currentMax - prevMax;
      const incomeInBracket = Math.min(rest, span);

      if (incomeInBracket <= 0) break;

      tax += incomeInBracket * bracket.rate;

      rest -= incomeInBracket;
      prevMax = currentMax;

      if (rest <= 0) break;
    }

    return tax;
  }
}
