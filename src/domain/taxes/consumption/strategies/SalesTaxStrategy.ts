import type { CalculatorInput } from '../../types';
import type { ConsumptionTax } from '../types';
import type { ConsumptionTaxStrategy } from './types';

export class SalesTaxStrategy implements ConsumptionTaxStrategy {
  readonly type = 'sales_tax' as const;

  calculate(inputs: CalculatorInput, tax: ConsumptionTax): number {
    const consumption = inputs.consumption ?? 0;
    return consumption * tax.rate;
  }
}
