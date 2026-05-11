import type { CalculatorInput } from '../../types';
import type { DeductionsResult } from '../../deductions/types';
import type { IncomeTax, IncomeTaxType } from '../types';

export interface IncomeTaxStrategy<T extends IncomeTax = IncomeTax> {
  readonly type: IncomeTaxType;
  calculate(
    input: CalculatorInput,
    deductions: DeductionsResult,
    taxConfig: T
  ): number;
}

export type AnyIncomeTaxStrategy = {
  [K in IncomeTaxType]: IncomeTaxStrategy<Extract<IncomeTax, { type: K }>>;
}[IncomeTaxType];

export type StrategyMap = {
  [K in IncomeTaxType]?: IncomeTaxStrategy<Extract<IncomeTax, { type: K }>>;
};
