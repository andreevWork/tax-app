import { describe, expect, it } from 'vitest';
import {
  TaxCalculator,
  DeductionCalculator,
  IncomeTaxCalculator,
  ConsumptionTaxCalculator,
} from '..';
import {
  DecoteStrategy,
  PostTaxAdjustmentCalculator,
} from '../postAdjustments';
import type { DecoteConfig } from '../postAdjustments';
import type { CalculatorInput, CountryTaxConfig } from '../types';

const frDecote: DecoteConfig = {
  type: 'decote',
  singleThreshold: 1982,
  jointThreshold: 3277,
  singleBase: 897,
  jointBase: 1483,
  rate: 0.4525,
};

const single: CalculatorInput = {
  gross: 0,
  childrenCount: 0,
  isMarried: false,
};

const married: CalculatorInput = {
  gross: 0,
  childrenCount: 0,
  isMarried: true,
};

describe('DecoteStrategy', () => {
  const strategy = new DecoteStrategy();

  it('has correct type', () => {
    expect(strategy.type).toBe('decote');
  });

  it('returns income tax unchanged when above single threshold', () => {
    expect(strategy.adjust(2000, single, frDecote)).toBe(2000);
  });

  it('returns income tax unchanged when above joint threshold', () => {
    expect(strategy.adjust(3300, married, frDecote)).toBe(3300);
  });

  it('applies décote for single taxpayer below threshold', () => {
    // incomeTax = 1000
    // décote = 897 - 0.4525 * 1000 = 444.5
    // adjusted = 1000 - 444.5 = 555.5
    expect(strategy.adjust(1000, single, frDecote)).toBeCloseTo(555.5);
  });

  it('applies décote for married taxpayer below threshold', () => {
    // incomeTax = 2000
    // décote = 1483 - 0.4525 * 2000 = 578
    // adjusted = 2000 - 578 = 1422
    expect(strategy.adjust(2000, married, frDecote)).toBeCloseTo(1422);
  });

  it('does not produce negative adjusted tax', () => {
    expect(strategy.adjust(0, single, frDecote)).toBe(0);
  });

  it('approaches zero reduction at single threshold boundary', () => {
    // At threshold: décote ≈ 0, no reduction
    const result = strategy.adjust(1982, single, frDecote);
    expect(result).toBeCloseTo(1982, 0);
  });
});

describe('PostTaxAdjustmentCalculator', () => {
  const calculator = new PostTaxAdjustmentCalculator();

  it('returns income tax unchanged when no adjustments', () => {
    expect(calculator.calculate(5000, single, [])).toBe(5000);
  });

  it('applies a single adjustment', () => {
    const result = calculator.calculate(1000, single, [frDecote]);
    expect(result).toBeCloseTo(555.5);
  });

  it('returns 0 for unknown adjustment type', () => {
    const unknown = { type: 'unknown' } as unknown as DecoteConfig;
    expect(calculator.calculate(1000, single, [unknown])).toBe(1000);
  });

  it('registers and uses a custom strategy', () => {
    const custom = new PostTaxAdjustmentCalculator({ strategies: [] });
    expect(custom.hasStrategy('decote')).toBe(false);
    custom.registerStrategy(new DecoteStrategy());
    expect(custom.hasStrategy('decote')).toBe(true);
  });
});

describe('TaxCalculator with postTaxAdjustments', () => {
  const calculator = new TaxCalculator(
    new DeductionCalculator(),
    new IncomeTaxCalculator(),
    new ConsumptionTaxCalculator()
  );

  const country: CountryTaxConfig = {
    countryCode: 'XX' as CountryTaxConfig['countryCode'],
    name: 'Testland' as CountryTaxConfig['name'],
    currency: 'EUR' as CountryTaxConfig['currency'],
    deductions: {
      personal: { amount: 0 },
      children: { type: 'none', incomeLimit: null, rules: [] },
    },
    incomeTax: { type: 'flat', brackets: [{ max: null, rate: 0.1 }] },
    consumptionTaxes: [],
    postTaxAdjustments: [frDecote],
  };

  it('applies décote when country config includes it', () => {
    // gross = 10_000, flat 10% → rawIncomeTax = 1000
    // décote = 897 - 0.4525 * 1000 = 444.5 → incomeTax = 555.5
    const result = calculator.calculate(
      { gross: 10_000, childrenCount: 0, isMarried: false },
      country
    );

    expect(result.taxes.incomeTax).toBeCloseTo(555.5);
  });

  it('does not apply décote when income tax exceeds threshold', () => {
    const result = calculator.calculate(
      { gross: 100_000, childrenCount: 0, isMarried: false },
      country
    );

    expect(result.taxes.incomeTax).toBe(10_000);
  });
});
