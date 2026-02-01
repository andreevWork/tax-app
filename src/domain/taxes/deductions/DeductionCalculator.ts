import type { CalculatorInput } from '../types';
import type { Deductions, DeductionsResult } from './types';
import { ChildrenDeductionCalculator } from './ChildrenDeductionCalculator';

export class DeductionCalculator {
  private readonly childrenDeductionCalculator: ChildrenDeductionCalculator;

  constructor(childrenDeductionCalculator?: ChildrenDeductionCalculator) {
    this.childrenDeductionCalculator =
      childrenDeductionCalculator ?? new ChildrenDeductionCalculator();
  }

  calculate(inputs: CalculatorInput, deductions: Deductions): DeductionsResult {
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
