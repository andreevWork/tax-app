import type { ChildDeductionRule, ChildrenDeduction } from '../../types/taxes';

export function calculateChildrenDeduction(
  gross: number,
  childrenCount: number,
  childrenDeductionConfig: ChildrenDeduction
): number {
  if (childrenDeductionConfig.type === 'none' || childrenCount === 0) return 0;
  let childrenDeductionTotal = 0;
  const limitAmount = childrenDeductionConfig.incomeLimit?.amount;

  switch (childrenDeductionConfig.type) {
    case 'per_child_monthly': {
      if (!limitAmount) {
        childrenDeductionTotal +=
          calcAmountPerMonth(childrenCount, childrenDeductionConfig.rules) * 12;
      } else {
        childrenDeductionTotal += calcDeductionWithMonthlyLimit(
          gross,
          childrenCount,
          limitAmount,
          childrenDeductionConfig.rules
        );
      }
      break;
    }
    case 'per_child_year': {
      if (!limitAmount || gross <= limitAmount) {
        childrenDeductionTotal += calcDeductionYear(
          childrenCount,
          childrenDeductionConfig.rules
        );
      }
      break;
    }
    default:
      throw new Error('Children Deduction Type is wrong');
  }

  return childrenDeductionTotal;
}

function calcDeductionWithMonthlyLimit(
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

  const amountPerMonth = calcAmountPerMonth(childrenCount, rules);

  return amountPerMonth * monthsWithinLimit;
}

function calcAmountPerMonth(
  childrenCount: number,
  rules: ChildDeductionRule[]
): number {
  let amount = 0;
  let lastApplicableAmount = 0;
  for (let count = 1; count <= childrenCount; count++) {
    const currentRule = rules.find((r) => r.childIndex === count);
    if (currentRule) {
      lastApplicableAmount = currentRule.amount;
    }
    amount += lastApplicableAmount;
  }
  return amount;
}

function calcDeductionYear(
  childrenCount: number,
  rules: ChildDeductionRule[]
): number {
  let totalAmount = 0;
  const ruleForAll = rules.find((r) => r.childIndex === 'all');
  for (let childNum = 1; childNum <= childrenCount; childNum++) {
    const specificRule = rules.find((r) => r.childIndex === childNum);

    if (specificRule) {
      totalAmount += specificRule.amount;
    } else if (ruleForAll) {
      totalAmount += ruleForAll.amount;
    }
  }

  return totalAmount;
}
