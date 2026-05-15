import type { CalculatorInput } from '../../../types';
import type { DeductionsResult } from '../../../deductions/types';
import type { TaxBracket } from '../../types';
import type { IncomeTaxStrategy } from '../types';
import { applyBrackets } from '../utils/applyBrackets';

export interface FranceFamilyQuotientConfig {
  type: 'unique';
  brackets: TaxBracket[];
  capPerHalfPart: number;
}

const MARRIED_PARTS = 2;
const SINGLE_PARTS = 1;
const REDUCED_RATE_CHILDREN = 2;
const HALF_PART_PER_CHILD = 0.5;

export class FranceFamilyQuotientStrategy
  implements IncomeTaxStrategy<FranceFamilyQuotientConfig>
{
  readonly type = 'unique' as const;
  readonly countryCode = 'FR' as const;

  calculate(
    input: CalculatorInput,
    _deductions: DeductionsResult,
    taxConfig: FranceFamilyQuotientConfig
  ): number {
    const { gross, isMarried, childrenCount } = input;

    const baseParts = isMarried ? MARRIED_PARTS : SINGLE_PARTS;
    const childParts =
      Math.min(childrenCount, REDUCED_RATE_CHILDREN) * HALF_PART_PER_CHILD +
      Math.max(0, childrenCount - REDUCED_RATE_CHILDREN);
    const totalParts = baseParts + childParts;

    const taxWithBaseParts =
      applyBrackets(gross / baseParts, taxConfig.brackets) * baseParts;

    if (childParts === 0) return taxWithBaseParts;

    const taxWithTotalParts =
      applyBrackets(gross / totalParts, taxConfig.brackets) * totalParts;

    const rawBenefit = taxWithBaseParts - taxWithTotalParts;

    const extraHalfParts = childParts / HALF_PART_PER_CHILD;
    const maxBenefit = taxConfig.capPerHalfPart * extraHalfParts;

    return taxWithBaseParts - Math.min(rawBenefit, maxBenefit);
  }
}
