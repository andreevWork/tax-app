import { describe, expect, it } from 'vitest';
import {
  ConsumptionTaxCalculator,
  DeductionCalculator,
  IncomeTaxCalculator,
  TaxCalculator,
} from '..';
import type { Country, UserInputs } from '../../../types/taxes';

describe('TaxCalculator', () => {
  const mockCountry: Country = {
    countryCode: 'XX' as Country['countryCode'],
    name: 'Testland' as Country['name'],
    currency: 'USD' as Country['currency'],
    deductions: {
      personal: { amount: 5000 },
      children: { type: 'none', incomeLimit: null, rules: [] },
    },
    incomeTax: {
      type: 'progressive',
      brackets: [
        { max: 50000, rate: 0.1 },
        { max: null, rate: 0.2 },
      ],
    },
    consumptionTaxes: [],
  };

  let calculator: TaxCalculator;

  it('calculates taxes correctly', () => {
    calculator = new TaxCalculator(
      new DeductionCalculator(),
      new IncomeTaxCalculator(),
      new ConsumptionTaxCalculator()
    );

    const inputs: UserInputs = {
      gross: 100_000,
      childrenCount: 0,
      isMarried: false,
    };

    const result = calculator.calculate(inputs, mockCountry);

    // Deductions: 5000 (personal)
    expect(result.deductions.personal).toBe(5000);
    expect(result.deductions.children).toBe(0);
    expect(result.deductions.totalDeductions).toBe(5000);

    // Taxable income: 100000 - 5000 = 95000
    expect(result.taxes.taxableIncome).toBe(95_000);

    // Income tax: 50000 * 0.1 + 45000 * 0.2 = 5000 + 9000 = 14000
    expect(result.taxes.incomeTax).toBe(14_000);
    expect(result.taxes.consumptionTax).toBe(0);
    expect(result.taxes.totalTax).toBe(14_000);

    expect(result.totals.grossIncome).toBe(100_000);
    expect(result.totals.netIncome).toBe(86_000);
    expect(result.totals.effectiveTaxRate).toBe(0.14);
  });

  it('handles married deductions', () => {
    calculator = new TaxCalculator(
      new DeductionCalculator(),
      new IncomeTaxCalculator(),
      new ConsumptionTaxCalculator()
    );

    const inputs: UserInputs = {
      gross: 50_000,
      childrenCount: 0,
      isMarried: true,
    };

    const result = calculator.calculate(inputs, mockCountry);

    // Married: 2 * 5000 = 10000
    expect(result.deductions.personal).toBe(10_000);
    expect(result.taxes.taxableIncome).toBe(40_000);
  });

  it('does not allow taxableIncome to be negative', () => {
    calculator = new TaxCalculator(
      new DeductionCalculator(),
      new IncomeTaxCalculator(),
      new ConsumptionTaxCalculator()
    );

    const inputs: UserInputs = {
      gross: 2_000,
      childrenCount: 0,
      isMarried: true, // 2 * 5000 = 10000 deduction
    };

    const result = calculator.calculate(inputs, mockCountry);

    expect(result.taxes.taxableIncome).toBe(0);
    expect(result.taxes.incomeTax).toBe(0);
    expect(result.totals.netIncome).toBe(2_000);
  });

  it('sets effectiveTaxRate to 0 when gross is 0', () => {
    calculator = new TaxCalculator(
      new DeductionCalculator(),
      new IncomeTaxCalculator(),
      new ConsumptionTaxCalculator()
    );

    const inputs: UserInputs = {
      gross: 0,
      childrenCount: 0,
      isMarried: false,
    };

    const result = calculator.calculate(inputs, mockCountry);

    expect(result.totals.effectiveTaxRate).toBe(0);
  });
});
