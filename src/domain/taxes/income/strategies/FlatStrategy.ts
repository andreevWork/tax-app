import type { IncomeTax } from '../types';
import type { IncomeTaxStrategy } from './types';

export class FlatStrategy
  implements IncomeTaxStrategy<Extract<IncomeTax, { type: 'flat' }>>
{
  readonly type = 'flat' as const;

  calculate(
    taxableIncome: number,
    taxConfig: Extract<IncomeTax, { type: 'flat' }>
  ): number {
    const rate = taxConfig.brackets.at(0)?.rate ?? 0;
    return taxableIncome * rate;
  }
}
