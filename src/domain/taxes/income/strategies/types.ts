import type { IncomeTax, IncomeTaxType } from '../../../../types/taxes';

export interface IncomeTaxStrategy {
  readonly type: IncomeTaxType;
  calculate(taxableIncome: number, taxConfig: IncomeTax): number;
}
