import type {
  ChildDeductionRule,
  ChildrenDeduction,
} from '../../../../types/taxes';
import type { ChildrenDeductionStrategy } from './types';

export class PerChildYearStrategy implements ChildrenDeductionStrategy {
  readonly type = 'per_child_year' as const;

  calculate(
    gross: number,
    childrenCount: number,
    config: ChildrenDeduction
  ): number {
    const limitAmount = config.incomeLimit?.amount;

    if (limitAmount && gross > limitAmount) {
      return 0;
    }

    return this.calcDeductionYear(childrenCount, config.rules);
  }

  private calcDeductionYear(
    childrenCount: number,
    rules: ChildDeductionRule[]
  ): number {
    let totalAmount = 0;
    const ruleForAll = rules.find((rule) => rule.childIndex === 'all');

    for (let childNum = 1; childNum <= childrenCount; childNum++) {
      const specificRule = rules.find((rule) => rule.childIndex === childNum);

      if (specificRule) {
        totalAmount += specificRule.amount;
      } else if (ruleForAll) {
        totalAmount += ruleForAll.amount;
      }
    }

    return totalAmount;
  }
}
