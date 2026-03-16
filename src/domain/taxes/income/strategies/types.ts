import type { IncomeTax, IncomeTaxType } from '../types';

export interface IncomeTaxStrategy<T extends IncomeTax = IncomeTax> {
  readonly type: IncomeTaxType;
  calculate(taxableIncome: number, taxConfig: T): number;
}

export type AnyIncomeTaxStrategy = {
  [K in IncomeTaxType]: IncomeTaxStrategy<Extract<IncomeTax, { type: K }>>;
}[IncomeTaxType];

export type StrategyMap = {
  [K in IncomeTaxType]?: IncomeTaxStrategy<Extract<IncomeTax, { type: K }>>;
};
