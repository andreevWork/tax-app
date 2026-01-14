import type {
  ChildrenDeduction,
  ConsumptionTax,
  Deductions,
  DeductionsResult,
  IncomeTax,
  UserInputs,
} from '../../types/taxes';

export interface ChildrenDeductionCalculatorPort {
  calculate(
    gross: number,
    childrenCount: number,
    config: ChildrenDeduction
  ): number;
}

export interface DeductionCalculatorPort {
  calculate(inputs: UserInputs, deductions: Deductions): DeductionsResult;
}

export interface IncomeTaxCalculatorPort {
  calculate(taxableIncome: number, incomeTax: IncomeTax): number;
}

export interface ConsumptionTaxCalculatorPort {
  calculate(inputs: UserInputs, consumptionTaxes: ConsumptionTax[]): number;
}
