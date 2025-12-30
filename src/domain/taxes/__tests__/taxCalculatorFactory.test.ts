import { describe, expect, it } from 'vitest';
import {
  TaxCalculatorFactory,
  TaxCalculator,
  PerChildMonthlyStrategy,
  ProgressiveStrategy,
  VatStrategy,
} from '..';
import type { Country, CountryCode, UserInputs } from '../../../types/taxes';

describe('TaxCalculatorFactory', () => {
  const mockCountry: Country = {
    countryCode: 'DE' as CountryCode,
    name: 'Germany' as Country['name'],
    currency: 'EUR' as Country['currency'],
    incomeTax: {
      type: 'progressive',
      brackets: [
        { max: 10000, rate: 0.1 },
        { max: null, rate: 0.2 },
      ],
    },
    deductions: {
      personal: { amount: 5000 },
      children: {
        type: 'per_child_year',
        incomeLimit: null,
        rules: [{ childIndex: 'all', amount: 1000 }],
      },
    },
    consumptionTaxes: [{ type: 'vat', rate: 0.19 }],
  };

  describe('create', () => {
    it('creates TaxCalculator without country code', () => {
      const factory = new TaxCalculatorFactory();
      const calculator = factory.create();

      expect(calculator).toBeInstanceOf(TaxCalculator);
    });

    it('creates TaxCalculator with country code', () => {
      const factory = new TaxCalculatorFactory();
      factory.registerCountryConfig('DE' as CountryCode, {});
      const calculator = factory.create('DE' as CountryCode);

      expect(calculator).toBeInstanceOf(TaxCalculator);
    });

    it('creates working calculator that calculates taxes', () => {
      const factory = new TaxCalculatorFactory();
      const calculator = factory.create();

      const inputs: UserInputs = {
        gross: 50_000,
        childrenCount: 1,
        isMarried: false,
        consumption: 10_000,
      };

      const result = calculator.calculate(inputs, mockCountry);

      expect(result.totals.grossIncome).toBe(50_000);
      expect(result.deductions.children).toBe(1000);
    });
  });

  describe('registerCountryConfig', () => {
    it('registers country-specific configuration', () => {
      const factory = new TaxCalculatorFactory();

      factory.registerCountryConfig('DE' as CountryCode, {
        childrenDeductionStrategies: [new PerChildMonthlyStrategy()],
      });

      expect(factory.hasCountryConfig('DE' as CountryCode)).toBe(true);
    });

    it('uses registered strategies for country', () => {
      const factory = new TaxCalculatorFactory();

      factory.registerCountryConfig('DE' as CountryCode, {
        incomeTaxStrategies: [new ProgressiveStrategy()],
        consumptionTaxStrategies: [new VatStrategy()],
      });

      const calculator = factory.create('DE' as CountryCode);
      expect(calculator).toBeInstanceOf(TaxCalculator);
    });
  });

  describe('unregisterCountryConfig', () => {
    it('removes registered country config', () => {
      const factory = new TaxCalculatorFactory();
      factory.registerCountryConfig('DE' as CountryCode, {});

      expect(factory.hasCountryConfig('DE' as CountryCode)).toBe(true);

      const result = factory.unregisterCountryConfig('DE' as CountryCode);

      expect(result).toBe(true);
      expect(factory.hasCountryConfig('DE' as CountryCode)).toBe(false);
    });

    it('returns false when unregistering non-existent config', () => {
      const factory = new TaxCalculatorFactory();
      const result = factory.unregisterCountryConfig('XX' as CountryCode);

      expect(result).toBe(false);
    });
  });

  describe('hasCountryConfig', () => {
    it('returns true for registered country', () => {
      const factory = new TaxCalculatorFactory();
      factory.registerCountryConfig('RU' as CountryCode, {});

      expect(factory.hasCountryConfig('RU' as CountryCode)).toBe(true);
    });

    it('returns false for unregistered country', () => {
      const factory = new TaxCalculatorFactory();

      expect(factory.hasCountryConfig('XX' as CountryCode)).toBe(false);
    });
  });

  describe('default options', () => {
    it('uses default options when no country config', () => {
      const factory = new TaxCalculatorFactory({
        defaultChildrenDeductionOptions: {
          strategies: [new PerChildMonthlyStrategy()],
        },
        defaultIncomeTaxOptions: {
          strategies: [new ProgressiveStrategy()],
        },
        defaultConsumptionTaxOptions: {
          strategies: [new VatStrategy()],
        },
      });

      const calculator = factory.create();
      expect(calculator).toBeInstanceOf(TaxCalculator);
    });

    it('country config overrides default options', () => {
      const factory = new TaxCalculatorFactory({
        defaultIncomeTaxOptions: {
          strategies: [new ProgressiveStrategy()],
        },
      });

      factory.registerCountryConfig('DE' as CountryCode, {
        incomeTaxStrategies: [new ProgressiveStrategy()],
      });

      const calculator = factory.create('DE' as CountryCode);
      expect(calculator).toBeInstanceOf(TaxCalculator);
    });
  });
});
