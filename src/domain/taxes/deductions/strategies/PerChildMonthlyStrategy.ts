import type {
  ChildDeductionRule,
  ChildrenDeduction,
} from '../../../../types/taxes';
import type { ChildrenDeductionStrategy } from './types';

export class PerChildMonthlyStrategy implements ChildrenDeductionStrategy {
  readonly type = 'per_child_monthly' as const;

  calculate(
    gross: number,
    childrenCount: number,
    config: ChildrenDeduction
  ): number {
    const limitAmount = config.incomeLimit?.amount;

    if (!limitAmount) {
      return this.calcAmountPerMonth(childrenCount, config.rules) * 12;
    }

    return this.calcDeductionWithMonthlyLimit(
      gross,
      childrenCount,
      limitAmount,
      config.rules
    );
  }

  private calcDeductionWithMonthlyLimit(
    gross: number,
    childrenCount: number,
    incomeLimitAmount: number,
    rules: ChildDeductionRule[]
  ): number {
    const grossPerMonth = gross / 12;
    const monthsWithinLimit = Math.min(
      12,
      Math.floor(incomeLimitAmount / grossPerMonth)
    );

    if (monthsWithinLimit <= 0) return 0;

    const amountPerMonth = this.calcAmountPerMonth(childrenCount, rules);

    return amountPerMonth * monthsWithinLimit;
  }

  private calcAmountPerMonth(
    childrenCount: number,
    rules: ChildDeductionRule[]
  ): number {
    let amount = 0;
    let lastApplicableAmount = 0;

    for (let count = 1; count <= childrenCount; count++) {
      const currentRule = rules.find((rule) => rule.childIndex === count);

      if (currentRule) {
        lastApplicableAmount = currentRule.amount;
      }

      amount += lastApplicableAmount;
    }

    return amount;
  }
}
