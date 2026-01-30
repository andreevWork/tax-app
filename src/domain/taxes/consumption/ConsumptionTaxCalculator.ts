import type {
  ConsumptionTax,
  ConsumptionTaxType,
  UserInputs,
} from '../../../types/taxes';
import {
  defaultConsumptionTaxStrategies,
  type ConsumptionTaxStrategy,
} from './strategies';

export interface ConsumptionTaxCalculatorOptions {
  strategies?: ConsumptionTaxStrategy[];
}

export class ConsumptionTaxCalculator {
  private readonly strategies: Map<ConsumptionTaxType, ConsumptionTaxStrategy>;

  constructor(options: ConsumptionTaxCalculatorOptions = {}) {
    const strategies = options.strategies ?? defaultConsumptionTaxStrategies;
    this.strategies = new Map(strategies.map((s) => [s.type, s]));
  }

  calculate(inputs: UserInputs, consumptionTaxes: ConsumptionTax[]): number {
    if (!consumptionTaxes.length) return 0;

    return consumptionTaxes.reduce((total, tax) => {
      const strategy = this.strategies.get(tax.type);

      if (!strategy) return total;

      return total + strategy.calculate(inputs, tax);
    }, 0);
  }

  registerStrategy(strategy: ConsumptionTaxStrategy): void {
    this.strategies.set(strategy.type, strategy);
  }

  hasStrategy(type: ConsumptionTaxType): boolean {
    return this.strategies.has(type);
  }
}
