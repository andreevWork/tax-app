import type { IncomeTax, IncomeTaxType } from '../../../types/taxes';
import type { IncomeTaxCalculatorPort } from '../ports';
import {
  defaultIncomeTaxStrategies,
  type IncomeTaxStrategy,
} from './strategies';

export interface IncomeTaxCalculatorOptions {
  strategies?: IncomeTaxStrategy[];
}

export class IncomeTaxCalculator implements IncomeTaxCalculatorPort {
  private readonly strategies: Map<IncomeTaxType, IncomeTaxStrategy>;

  constructor(options: IncomeTaxCalculatorOptions = {}) {
    const strategies = options.strategies ?? defaultIncomeTaxStrategies;
    this.strategies = new Map(strategies.map((s) => [s.type, s]));
  }

  calculate(taxableIncome: number, taxes: IncomeTax): number {
    const strategy = this.strategies.get(taxes.type);

    if (!strategy) return 0;

    return Math.max(0, strategy.calculate(taxableIncome, taxes));
  }

  registerStrategy(strategy: IncomeTaxStrategy): void {
    this.strategies.set(strategy.type, strategy);
  }

  hasStrategy(type: IncomeTaxType): boolean {
    return this.strategies.has(type);
  }
}
