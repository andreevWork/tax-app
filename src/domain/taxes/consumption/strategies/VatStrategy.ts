import type { ConsumptionTax, UserInputs } from '../../../../types/taxes';
import type { ConsumptionTaxStrategy } from './types';

export class VatStrategy implements ConsumptionTaxStrategy {
  readonly type = 'vat' as const;

  calculate(inputs: UserInputs, tax: ConsumptionTax): number {
    const consumption = inputs.consumption ?? 0;
    return consumption * tax.rate;
  }
}
