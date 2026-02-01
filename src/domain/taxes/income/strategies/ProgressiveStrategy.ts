import type { IncomeTax } from '../types';
import type { IncomeTaxStrategy } from './types';

export class ProgressiveStrategy implements IncomeTaxStrategy {
  readonly type = 'progressive' as const;

  calculate(taxableIncome: number, taxes: IncomeTax): number {
    let rest = taxableIncome;
    let tax = 0;
    let prevMax = 0;

    for (const bracket of taxes.brackets) {
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
