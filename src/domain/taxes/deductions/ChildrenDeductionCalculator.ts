import type {
  ChildrenDeduction,
  ChildrenDeductionType,
} from '../../../types/taxes';
import {
  defaultChildrenDeductionStrategies,
  type ChildrenDeductionStrategy,
} from './strategies';

export interface ChildrenDeductionCalculatorOptions {
  strategies?: ChildrenDeductionStrategy[];
}

export class ChildrenDeductionCalculator {
  private readonly strategies: Map<
    ChildrenDeductionType,
    ChildrenDeductionStrategy
  >;

  constructor(options: ChildrenDeductionCalculatorOptions = {}) {
    const strategies = options.strategies ?? defaultChildrenDeductionStrategies;
    this.strategies = new Map(strategies.map((s) => [s.type, s]));
  }

  calculate(
    gross: number,
    childrenCount: number,
    config: ChildrenDeduction
  ): number {
    if (childrenCount === 0) return 0;

    const strategy = this.strategies.get(config.type);

    if (!strategy) return 0;

    return strategy.calculate(gross, childrenCount, config);
  }

  registerStrategy(strategy: ChildrenDeductionStrategy): void {
    this.strategies.set(strategy.type, strategy);
  }

  hasStrategy(type: ChildrenDeductionType): boolean {
    return this.strategies.has(type);
  }
}
