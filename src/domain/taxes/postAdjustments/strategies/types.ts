import type { CalculatorInput } from '../../types';
import type { PostTaxAdjustment, PostTaxAdjustmentType } from '../types';

export interface PostTaxAdjustmentStrategy<
  T extends PostTaxAdjustment = PostTaxAdjustment,
> {
  readonly type: PostTaxAdjustmentType;
  adjust(incomeTax: number, input: CalculatorInput, config: T): number;
}
