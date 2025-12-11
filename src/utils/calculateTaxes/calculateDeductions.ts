import type { Country, DeductionsResult, UserInputs } from '../../types/taxes';
import { calculateChildrenDeduction } from './calculateChildrenDeduction';

export function calculateDeductions(
  inputs: UserInputs,
  country: Country
): DeductionsResult {
  const { gross, childrenCount, isMarried } = inputs;

  const personalDeduction = country.deductions.personal.amount;
  const personalDeductionTotal = isMarried
    ? 2 * personalDeduction
    : personalDeduction;

  const childrenDeductionTotal = calculateChildrenDeduction(
    gross,
    childrenCount,
    country.deductions.children
  );

  return {
    personal: personalDeductionTotal,
    children: childrenDeductionTotal,
    totalDeductions: personalDeductionTotal + childrenDeductionTotal,
  };
}
