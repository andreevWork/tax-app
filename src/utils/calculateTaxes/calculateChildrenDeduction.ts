import type { ChildDeductionRule, ChildrenDeduction } from '../../types/taxes';

export function calculateChildrenDeduction(
  gross: number,
  childrenCount: number,
  childrenDeductionConfig: ChildrenDeduction
): number {
  if (childrenDeductionConfig.type === 'none' || childrenCount === 0) return 0;
  let childrenDeductionTotal = 0;

  switch (childrenDeductionConfig.type) {
    case 'per_child_monthly': {
      if (childrenDeductionConfig.incomeLimit) {
        childrenDeductionTotal += calcDeductionWithMonthlyLimit(
          gross,
          childrenCount,
          childrenDeductionConfig.incomeLimit.amount,
          childrenDeductionConfig.rules
        );
      }
      break;
    }
    case 'per_child_year': {
      if (!childrenDeductionConfig.incomeLimit) {
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
  let deductionResult = 0;
  const grossPerMonth = gross / 12;
  const monthsWithinLimit = incomeLimitAmount % grossPerMonth;
  const amountPerMonth = calcAmountPerMonth(childrenCount, rules);

  for (let monthCount = 0; monthCount <= monthsWithinLimit; monthCount++) {
    deductionResult += amountPerMonth;
  }
  return deductionResult;
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
  let amount = 0;
  const ruleForAll = rules.find((r) => r.childIndex === 'all');
  if (ruleForAll) {
    amount = childrenCount * ruleForAll.amount;
  }

  return amount;
}
