import type { IncomeTax, IncomeTaxType } from '../types';

export interface IncomeTaxStrategy {
  readonly type: IncomeTaxType;
  calculate(taxableIncome: number, taxConfig: IncomeTax): number;
}
