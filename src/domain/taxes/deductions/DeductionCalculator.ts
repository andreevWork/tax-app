import type {
  Deductions,
  DeductionsResult,
  UserInputs,
} from '../../../types/taxes';
import type {
  ChildrenDeductionCalculatorPort,
  DeductionCalculatorPort,
} from '../ports';
import { ChildrenDeductionCalculator } from './ChildrenDeductionCalculator';

export interface DeductionCalculatorOptions {
  childrenDeductionCalculator?: ChildrenDeductionCalculatorPort;
}

export class DeductionCalculator implements DeductionCalculatorPort {
  private readonly childrenDeductionCalculator: ChildrenDeductionCalculatorPort;

  constructor(options: DeductionCalculatorOptions = {}) {
    this.childrenDeductionCalculator =
      options.childrenDeductionCalculator ?? new ChildrenDeductionCalculator();
  }

  calculate(inputs: UserInputs, deductions: Deductions): DeductionsResult {
    const { gross, childrenCount, isMarried } = inputs;

    const personalDeduction = deductions.personal.amount;
    const personalDeductionTotal = isMarried
      ? 2 * personalDeduction
      : personalDeduction;

    const childrenDeductionTotal = this.childrenDeductionCalculator.calculate(
      gross,
      childrenCount,
      deductions.children
    );

    return {
      personal: personalDeductionTotal,
      children: childrenDeductionTotal,
      totalDeductions: personalDeductionTotal + childrenDeductionTotal,
    };
  }
}
