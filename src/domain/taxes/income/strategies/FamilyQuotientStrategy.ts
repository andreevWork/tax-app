import type { CalculatorInput } from '../../types';
import type { DeductionsResult } from '../../deductions/types';
import type { IncomeTax } from '../types';
import type { IncomeTaxStrategy } from './types';
import { applyBrackets } from './applyBrackets';

type FamilyQuotientIncomeTax = Extract<IncomeTax, { type: 'family_quotient' }>;

export class FamilyQuotientStrategy
  implements IncomeTaxStrategy<FamilyQuotientIncomeTax>
{
  readonly type = 'family_quotient' as const;

  calculate(
    input: CalculatorInput,
    _deductions: DeductionsResult,
    taxConfig: FamilyQuotientIncomeTax
  ): number {
    const { gross, isMarried, childrenCount } = input;

    const baseParts = isMarried ? 2 : 1;
    // First two children each add 1/2 part; third child onward adds 1 full part
    const childParts =
      Math.min(childrenCount, 2) * 0.5 + Math.max(0, childrenCount - 2);
    const totalParts = baseParts + childParts;

    const taxWithBaseParts =
      applyBrackets(gross / baseParts, taxConfig.brackets) * baseParts;

    if (childParts === 0) return taxWithBaseParts;

    const taxWithTotalParts =
      applyBrackets(gross / totalParts, taxConfig.brackets) * totalParts;

    const rawBenefit = taxWithBaseParts - taxWithTotalParts;

    // Cap: 1 half-part per child up to 2; 2 half-parts per child beyond 2
    const extraHalfParts =
      Math.min(childrenCount, 2) + Math.max(0, childrenCount - 2) * 2;
    const maxBenefit = taxConfig.capPerHalfPart * extraHalfParts;

    return taxWithBaseParts - Math.min(rawBenefit, maxBenefit);
  }
}
