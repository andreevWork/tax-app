import type { CalculatorInput } from '../../types';
import type { DecoteConfig } from '../types';
import type { PostTaxAdjustmentStrategy } from './types';

export class DecoteStrategy implements PostTaxAdjustmentStrategy {
  readonly type = 'decote' as const;

  adjust(
    incomeTax: number,
    input: CalculatorInput,
    config: DecoteConfig
  ): number {
    const threshold = input.isMarried
      ? config.jointThreshold
      : config.singleThreshold;

    if (incomeTax >= threshold) return incomeTax;

    const base = input.isMarried ? config.jointBase : config.singleBase;
    const decote = base - config.rate * incomeTax;
    return Math.max(0, incomeTax - decote);
  }
}
