import type { CountryCode } from '../../../types/taxes';
import {
  ConsumptionTaxCalculator,
  type ConsumptionTaxCalculatorOptions,
  type ConsumptionTaxStrategy,
} from '../consumption';
import {
  ChildrenDeductionCalculator,
  DeductionCalculator,
  type ChildrenDeductionCalculatorOptions,
  type ChildrenDeductionStrategy,
} from '../deductions';
import {
  IncomeTaxCalculator,
  type IncomeTaxCalculatorOptions,
  type IncomeTaxStrategy,
} from '../income';
import {
  TaxCalculator,
  type TaxCalculatorDependencies,
} from '../TaxCalculator';

export interface CountryTaxConfig {
  childrenDeductionStrategies?: ChildrenDeductionStrategy[];
  incomeTaxStrategies?: IncomeTaxStrategy[];
  consumptionTaxStrategies?: ConsumptionTaxStrategy[];
}

export interface TaxCalculatorFactoryOptions {
  defaultChildrenDeductionOptions?: ChildrenDeductionCalculatorOptions;
  defaultIncomeTaxOptions?: IncomeTaxCalculatorOptions;
  defaultConsumptionTaxOptions?: ConsumptionTaxCalculatorOptions;
}

export class TaxCalculatorFactory {
  private readonly countryConfigs: Map<CountryCode, CountryTaxConfig> =
    new Map();
  private readonly defaultOptions: TaxCalculatorFactoryOptions;

  constructor(options: TaxCalculatorFactoryOptions = {}) {
    this.defaultOptions = options;
  }

  registerCountryConfig(
    countryCode: CountryCode,
    config: CountryTaxConfig
  ): void {
    this.countryConfigs.set(countryCode, config);
  }

  unregisterCountryConfig(countryCode: CountryCode): boolean {
    return this.countryConfigs.delete(countryCode);
  }

  hasCountryConfig(countryCode: CountryCode): boolean {
    return this.countryConfigs.has(countryCode);
  }

  create(countryCode?: CountryCode): TaxCalculator {
    const countryConfig = countryCode
      ? this.countryConfigs.get(countryCode)
      : undefined;

    const dependencies = this.buildDependencies(countryConfig);

    return new TaxCalculator(dependencies);
  }

  private buildDependencies(
    countryConfig?: CountryTaxConfig
  ): TaxCalculatorDependencies {
    const childrenDeductionCalculator = new ChildrenDeductionCalculator({
      strategies:
        countryConfig?.childrenDeductionStrategies ??
        this.defaultOptions.defaultChildrenDeductionOptions?.strategies,
    });

    const deductionCalculator = new DeductionCalculator({
      childrenDeductionCalculator,
    });

    const incomeTaxCalculator = new IncomeTaxCalculator({
      strategies:
        countryConfig?.incomeTaxStrategies ??
        this.defaultOptions.defaultIncomeTaxOptions?.strategies,
    });

    const consumptionTaxCalculator = new ConsumptionTaxCalculator({
      strategies:
        countryConfig?.consumptionTaxStrategies ??
        this.defaultOptions.defaultConsumptionTaxOptions?.strategies,
    });

    return {
      deductionCalculator,
      incomeTaxCalculator,
      consumptionTaxCalculator,
    };
  }
}
