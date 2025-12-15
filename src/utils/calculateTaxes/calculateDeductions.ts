import type {
  Deductions,
  DeductionsResult,
  UserInputs,
} from '../../types/taxes';
import { calculateChildrenDeduction } from './calculateChildrenDeduction';

export function calculateDeductions(
  inputs: UserInputs,
  deductions: Deductions
): DeductionsResult {
  const { gross, childrenCount, isMarried } = inputs;

  const personalDeduction = deductions.personal.amount;
  const personalDeductionTotal = isMarried
    ? 2 * personalDeduction
    : personalDeduction;

  const childrenDeductionTotal = calculateChildrenDeduction(
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
