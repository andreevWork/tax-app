import type { IncomeTax, IncomeTaxType } from './types';
import {
  defaultIncomeTaxStrategies,
  type IncomeTaxStrategy,
  type AnyIncomeTaxStrategy,
  type StrategyMap,
} from './strategies';

export interface IncomeTaxCalculatorOptions {
  strategies?: AnyIncomeTaxStrategy[];
}

export class IncomeTaxCalculator {
  private readonly strategies: StrategyMap = {};

  constructor(options: IncomeTaxCalculatorOptions = {}) {
    const strategies = options.strategies ?? defaultIncomeTaxStrategies;
    for (const s of strategies) {
      this.registerStrategy(s);
    }
  }

  calculate(taxableIncome: number, taxes: IncomeTax): number {
    const strategy = this.strategies[taxes.type] as
      | AnyIncomeTaxStrategy
      | undefined;

    if (!strategy) return 0;

    type GenericStrategy = IncomeTaxStrategy;
    return Math.max(
      0,
      (strategy as unknown as GenericStrategy).calculate(taxableIncome, taxes)
    );
  }

  registerStrategy(strategy: AnyIncomeTaxStrategy): void {
    // Requires a type assertion to bypass correlated union indexing limits
    const typedStrategies = this.strategies as Record<
      string,
      AnyIncomeTaxStrategy
    >;
    typedStrategies[strategy.type] = strategy;
  }

  hasStrategy(type: IncomeTaxType): boolean {
    return this.strategies[type] !== undefined;
  }
}
