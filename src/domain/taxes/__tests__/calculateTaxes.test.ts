import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  TaxCalculator,
  type ConsumptionTaxCalculatorPort,
  type DeductionCalculatorPort,
  type IncomeTaxCalculatorPort,
} from '..';
import type {
  Country,
  DeductionsResult,
  UserInputs,
} from '../../../types/taxes';

describe('TaxCalculator', () => {
  const deductionCalculateMock =
    vi.fn<
      (
        inputs: UserInputs,
        deductions: Country['deductions']
      ) => DeductionsResult
    >();
  const incomeTaxCalculateMock =
    vi.fn<(taxableIncome: number, incomeTax: Country['incomeTax']) => number>();
  const consumptionTaxCalculateMock =
    vi.fn<(inputs: UserInputs, taxes: Country['consumptionTaxes']) => number>();

  const deductionCalculator: DeductionCalculatorPort = {
    calculate: deductionCalculateMock,
  };

  const incomeTaxCalculator: IncomeTaxCalculatorPort = {
    calculate: incomeTaxCalculateMock,
  };

  const consumptionTaxCalculator: ConsumptionTaxCalculatorPort = {
    calculate: consumptionTaxCalculateMock,
  };

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
      brackets: [{ max: null, rate: 0.1 }],
    },
    consumptionTaxes: [],
  };

  let calculator: TaxCalculator;

  beforeEach(() => {
    vi.clearAllMocks();
    calculator = new TaxCalculator({
      deductionCalculator,
      incomeTaxCalculator,
      consumptionTaxCalculator,
    });
  });

  it('calculates taxes with injected calculators', () => {
    const inputs: UserInputs = {
      gross: 100_000,
      childrenCount: 2,
      isMarried: false,
    };

    deductionCalculateMock.mockReturnValue({
      personal: 10_000,
      children: 5_000,
      totalDeductions: 15_000,
    });

    incomeTaxCalculateMock.mockReturnValue(17_000);
    consumptionTaxCalculateMock.mockReturnValue(3_000);

    const result = calculator.calculate(inputs, mockCountry);

    expect(deductionCalculateMock).toHaveBeenCalledWith(
      inputs,
      mockCountry.deductions
    );

    expect(incomeTaxCalculateMock).toHaveBeenCalledWith(
      85_000,
      mockCountry.incomeTax
    );

    expect(consumptionTaxCalculateMock).toHaveBeenCalledWith(
      inputs,
      mockCountry.consumptionTaxes
    );

    expect(result).toEqual({
      deductions: {
        personal: 10_000,
        children: 5_000,
        totalDeductions: 15_000,
      },
      taxes: {
        taxableIncome: 85_000,
        incomeTax: 17_000,
        consumptionTax: 3_000,
        totalTax: 20_000,
      },
      totals: {
        grossIncome: 100_000,
        netIncome: 80_000,
        effectiveTaxRate: 0.2,
      },
    });
  });

  it('does not allow taxableIncome to be negative', () => {
    const inputs: UserInputs = {
      gross: 10_000,
      childrenCount: 1,
      isMarried: true,
    };

    deductionCalculateMock.mockReturnValue({
      personal: 15_000,
      children: 5_000,
      totalDeductions: 20_000,
    });

    incomeTaxCalculateMock.mockReturnValue(0);
    consumptionTaxCalculateMock.mockReturnValue(0);

    const result = calculator.calculate(inputs, mockCountry);

    expect(result.taxes.taxableIncome).toBe(0);
    expect(result.totals.netIncome).toBe(10_000);
  });

  it('sets effectiveTaxRate to 0 when gross is 0', () => {
    const inputs: UserInputs = {
      gross: 0,
      childrenCount: 0,
      isMarried: false,
    };

    deductionCalculateMock.mockReturnValue({
      personal: 0,
      children: 0,
      totalDeductions: 0,
    });

    incomeTaxCalculateMock.mockReturnValue(0);
    consumptionTaxCalculateMock.mockReturnValue(0);

    const result = calculator.calculate(inputs, mockCountry);

    expect(result.totals.effectiveTaxRate).toBe(0);
  });

  describe('default calculators', () => {
    it('creates default calculators when no dependencies provided', () => {
      const defaultCalculator = new TaxCalculator();

      const inputs: UserInputs = {
        gross: 50_000,
        childrenCount: 0,
        isMarried: false,
      };

      const result = defaultCalculator.calculate(inputs, mockCountry);

      expect(result.totals.grossIncome).toBe(50_000);
      expect(result.deductions.personal).toBe(5000);
    });

    it('uses provided deduction calculator but defaults others', () => {
      const partialCalculator = new TaxCalculator({
        deductionCalculator,
      });

      deductionCalculateMock.mockReturnValue({
        personal: 1000,
        children: 0,
        totalDeductions: 1000,
      });

      const inputs: UserInputs = {
        gross: 50_000,
        childrenCount: 0,
        isMarried: false,
      };

      const result = partialCalculator.calculate(inputs, mockCountry);

      expect(result.deductions.personal).toBe(1000);
    });

    it('uses provided income tax calculator but defaults others', () => {
      const partialCalculator = new TaxCalculator({
        incomeTaxCalculator,
      });

      incomeTaxCalculateMock.mockReturnValue(5000);

      const inputs: UserInputs = {
        gross: 50_000,
        childrenCount: 0,
        isMarried: false,
      };

      const result = partialCalculator.calculate(inputs, mockCountry);

      expect(result.taxes.incomeTax).toBe(5000);
    });

    it('uses provided consumption tax calculator but defaults others', () => {
      const partialCalculator = new TaxCalculator({
        consumptionTaxCalculator,
      });

      consumptionTaxCalculateMock.mockReturnValue(2000);

      const inputs: UserInputs = {
        gross: 50_000,
        childrenCount: 0,
        isMarried: false,
        consumption: 10_000,
      };

      const result = partialCalculator.calculate(inputs, mockCountry);

      expect(result.taxes.consumptionTax).toBe(2000);
    });
  });
});
