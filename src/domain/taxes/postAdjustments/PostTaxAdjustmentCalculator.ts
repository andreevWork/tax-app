import type { CalculatorInput } from '../types';
import type { PostTaxAdjustment, PostTaxAdjustmentType } from './types';
import {
  defaultPostTaxAdjustmentStrategies,
  type PostTaxAdjustmentStrategy,
} from './strategies';

export interface PostTaxAdjustmentCalculatorOptions {
  strategies?: PostTaxAdjustmentStrategy[];
}

export class PostTaxAdjustmentCalculator {
  private readonly strategies: Map<
    PostTaxAdjustmentType,
    PostTaxAdjustmentStrategy
  >;

  constructor(options: PostTaxAdjustmentCalculatorOptions = {}) {
    const strategies = options.strategies ?? defaultPostTaxAdjustmentStrategies;
    this.strategies = new Map(strategies.map((s) => [s.type, s]));
  }

  calculate(
    incomeTax: number,
    input: CalculatorInput,
    adjustments: PostTaxAdjustment[]
  ): number {
    if (!adjustments.length) return incomeTax;

    return adjustments.reduce((tax, adjustment) => {
      const strategy = this.strategies.get(adjustment.type);
      if (!strategy) return tax;
      return strategy.adjust(tax, input, adjustment);
    }, incomeTax);
  }

  registerStrategy(strategy: PostTaxAdjustmentStrategy): void {
    this.strategies.set(strategy.type, strategy);
  }

  hasStrategy(type: PostTaxAdjustmentType): boolean {
    return this.strategies.has(type);
  }
}
