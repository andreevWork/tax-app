import type { CalculatorInput } from '../../types';
import type { ConsumptionTax } from '../types';
import type { ConsumptionTaxStrategy } from './types';

export class VatStrategy implements ConsumptionTaxStrategy {
  readonly type = 'vat' as const;

  calculate(inputs: CalculatorInput, tax: ConsumptionTax): number {
    const consumption = inputs.consumption ?? 0;
    return consumption * tax.rate;
  }
}
