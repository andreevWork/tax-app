export { ChildrenDeductionCalculator } from './ChildrenDeductionCalculator';
export type { ChildrenDeductionCalculatorOptions } from './ChildrenDeductionCalculator';
export { DeductionCalculator } from './DeductionCalculator';

export {
  defaultChildrenDeductionStrategies,
  NoneStrategy,
  PerChildMonthlyStrategy,
  PerChildYearStrategy,
  type ChildrenDeductionStrategy,
} from './strategies';

export type {
  ChildDeductionRule,
  ChildIndex,
  ChildrenDeduction,
  ChildrenDeductionType,
  Deductions,
  DeductionsResult,
  IncomeLimit,
  NoChildrenDeduction,
  PerChildMonthlyDeduction,
  PerChildYearDeduction,
  Period,
  PersonalDeduction,
} from './types';
