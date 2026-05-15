import type { CalculatorInput, CountryCode } from '../types';
import type { DeductionsResult } from '../deductions/types';
import type { IncomeTax, IncomeTaxType } from './types';
import {
  defaultIncomeTaxStrategies,
  type IncomeTaxStrategy,
} from './strategies';

export interface IncomeTaxCalculatorOptions {
  strategies?: IncomeTaxStrategy[];
}

export class IncomeTaxCalculator {
  private readonly strategiesByType: Record<string, IncomeTaxStrategy> = {};
  private readonly uniqueStrategiesByCountry: Record<
    string,
    IncomeTaxStrategy
  > = {};

  constructor(options: IncomeTaxCalculatorOptions = {}) {
    const strategies = options.strategies ?? defaultIncomeTaxStrategies;
    for (const s of strategies) {
      this.registerStrategy(s);
    }
  }

  calculate(
    input: CalculatorInput,
    deductions: DeductionsResult,
    taxes: IncomeTax,
    countryCode?: CountryCode
  ): number {
    const strategy = this.selectStrategy(taxes.type, countryCode);
    if (!strategy) return 0;

    // Cast: at this boundary IncomeTax is wider than the strategy's narrow
    // config type. Strategy correctness for its country is enforced by
    // Zod validation upstream and by the (type, countryCode) routing.
    return Math.max(0, strategy.calculate(input, deductions, taxes as never));
  }

  registerStrategy(strategy: IncomeTaxStrategy): void {
    if (strategy.type === 'unique') {
      const { countryCode } = strategy;
      if (typeof countryCode !== 'string') {
        throw new Error(
          `Strategy with type "unique" must declare a countryCode (got: ${strategy.constructor.name})`
        );
      }
      this.uniqueStrategiesByCountry[countryCode] = strategy;
    } else {
      this.strategiesByType[strategy.type] = strategy;
    }
  }

  hasStrategy(type: IncomeTaxType, countryCode?: string): boolean {
    return this.selectStrategy(type, countryCode) !== undefined;
  }

  private selectStrategy(
    type: IncomeTaxType,
    countryCode: string | undefined
  ): IncomeTaxStrategy | undefined {
    if (type === 'unique') {
      return countryCode
        ? this.uniqueStrategiesByCountry[countryCode]
        : undefined;
    }
    return this.strategiesByType[type];
  }
}
