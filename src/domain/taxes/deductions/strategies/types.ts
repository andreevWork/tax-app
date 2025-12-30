import type {
  ChildDeductionRule,
  ChildrenDeduction,
  ChildrenDeductionType,
} from '../../../../types/taxes';

export interface ChildrenDeductionStrategy {
  readonly type: ChildrenDeductionType;
  calculate(
    gross: number,
    childrenCount: number,
    config: ChildrenDeduction
  ): number;
}

export interface ChildrenDeductionStrategyHelpers {
  calcAmountPerMonth(
    childrenCount: number,
    rules: ChildDeductionRule[]
  ): number;
  calcDeductionYear(childrenCount: number, rules: ChildDeductionRule[]): number;
}
