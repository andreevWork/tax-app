import type { IncomeTax } from '../../../../types/taxes';
import type { IncomeTaxStrategy } from './types';

export class FlatStrategy implements IncomeTaxStrategy {
  readonly type = 'flat' as const;

  calculate(taxableIncome: number, taxes: IncomeTax): number {
    const rate = taxes.brackets.at(0)?.rate ?? 0;
    return taxableIncome * rate;
  }
}
