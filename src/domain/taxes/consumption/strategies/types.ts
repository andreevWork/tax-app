import type { CalculatorInput } from '../../types';
import type { ConsumptionTax, ConsumptionTaxType } from '../types';

export interface ConsumptionTaxStrategy {
  readonly type: ConsumptionTaxType;
  calculate(inputs: CalculatorInput, tax: ConsumptionTax): number;
}
