import type {
  ConsumptionTax,
  ConsumptionTaxType,
  UserInputs,
} from '../../../../types/taxes';

export interface ConsumptionTaxStrategy {
  readonly type: ConsumptionTaxType;
  calculate(inputs: UserInputs, tax: ConsumptionTax): number;
}
