import { describe, expect, it } from 'vitest';
import {
  FlatStrategy,
  IncomeTaxCalculator,
  ProgressiveStrategy,
} from '../income';
import type { IncomeTax } from '../income/types';
import type { CalculatorInput } from '../types';
import type { DeductionsResult } from '../deductions/types';

const calculator = new IncomeTaxCalculator();

function input(gross: number): CalculatorInput {
  return { gross, childrenCount: 0, isMarried: false };
}

const noDeductions: DeductionsResult = {
  personal: 0,
  children: 0,
  totalDeductions: 0,
};

describe('IncomeTaxCalculator', () => {
  describe('base cases', () => {
    it('calculates flat tax using the first bracket rate', () => {
      const taxes: IncomeTax = {
        type: 'flat',
        brackets: [
          { max: 50_000, rate: 0.1 },
          { max: null, rate: 0.2 },
        ],
      };

      const result = calculator.calculate(input(100_000), noDeductions, taxes);

      expect(result).toBe(10_000);
    });

    it('returns 0 when taxable income is 0', () => {
      const taxes: IncomeTax = {
        type: 'progressive',
        brackets: [{ max: null, rate: 0.2 }],
      };

      const result = calculator.calculate(input(0), noDeductions, taxes);

      expect(result).toBe(0);
    });

    it('returns 0 for unknown tax type', () => {
      const taxes = {
        type: 'unknown',
        brackets: [{ max: null, rate: 0.2 }],
      } as unknown as IncomeTax;

      const result = calculator.calculate(input(100_000), noDeductions, taxes);

      expect(result).toBe(0);
    });
  });

  describe('multiple brackets', () => {
    it('calculates tax across several brackets', () => {
      const taxes: IncomeTax = {
        type: 'progressive',
        brackets: [
          { max: 50_000, rate: 0.1 },
          { max: 100_000, rate: 0.2 },
          { max: null, rate: 0.3 },
        ],
      };

      const result = calculator.calculate(input(120_000), noDeductions, taxes);

      /**
       * 50k * 0.1 = 5k
       * 50k * 0.2 = 10k
       * 20k * 0.3 = 6k
       * total = 21k
       */
      expect(result).toBe(21_000);
    });
  });

  describe('edge cases', () => {
    it('handles income exactly on bracket boundary', () => {
      const taxes: IncomeTax = {
        type: 'progressive',
        brackets: [
          { max: 50_000, rate: 0.1 },
          { max: null, rate: 0.2 },
        ],
      };

      const result = calculator.calculate(input(50_000), noDeductions, taxes);

      expect(result).toBe(5_000);
    });

    it('handles flat tax with empty brackets', () => {
      const taxes: IncomeTax = {
        type: 'flat',
        brackets: [],
      };

      const result = calculator.calculate(input(100_000), noDeductions, taxes);

      expect(result).toBe(0);
    });
  });

  describe('registerStrategy', () => {
    it('allows registering custom strategy', () => {
      const customCalculator = new IncomeTaxCalculator({ strategies: [] });
      customCalculator.registerStrategy(new FlatStrategy());

      const taxes: IncomeTax = {
        type: 'flat',
        brackets: [{ max: null, rate: 0.15 }],
      };

      expect(
        customCalculator.calculate(input(100_000), noDeductions, taxes)
      ).toBe(15_000);
    });
  });

  describe('hasStrategy', () => {
    it('returns true for registered strategy', () => {
      expect(calculator.hasStrategy('progressive')).toBe(true);
      expect(calculator.hasStrategy('flat')).toBe(true);
    });

    it('returns false for unregistered strategy', () => {
      const emptyCalculator = new IncomeTaxCalculator({ strategies: [] });
      expect(emptyCalculator.hasStrategy('progressive')).toBe(false);
    });
  });
});

describe('Income Tax Strategies', () => {
  describe('ProgressiveStrategy', () => {
    it('has correct type', () => {
      const strategy = new ProgressiveStrategy();
      expect(strategy.type).toBe('progressive');
    });
  });

  describe('FlatStrategy', () => {
    it('has correct type', () => {
      const strategy = new FlatStrategy();
      expect(strategy.type).toBe('flat');
    });
  });
});

describe('GermanyFormulaStrategy — §32a EStG 2026 German tax table', () => {
  const calculator = new IncomeTaxCalculator();

  const germanyFormula: IncomeTax = {
    type: 'unique',
    formulaZones: [
      {
        upTo: 12348,
        a: 0,
        b: 0,
        c: 0,
        variableOffset: 0,
        variableDivisor: 1,
        usesVariable: false,
      },
      {
        upTo: 17799,
        a: 914.51,
        b: 1400,
        c: 0,
        variableOffset: 12348,
        variableDivisor: 10000,
        usesVariable: true,
      },
      {
        upTo: 69878,
        a: 173.1,
        b: 2397,
        c: 1034.87,
        variableOffset: 17799,
        variableDivisor: 10000,
        usesVariable: true,
      },
      {
        upTo: 277825,
        a: 0.42,
        b: -11135.63,
        c: 0,
        variableOffset: 0,
        variableDivisor: 1,
        usesVariable: false,
      },
      {
        upTo: null,
        a: 0.45,
        b: -19470.38,
        c: 0,
        variableOffset: 0,
        variableDivisor: 1,
        usesVariable: false,
      },
    ],
  };

  /**
   * Values from the official Einkommenssteuertabelle 2026 (Grundtabelle).
   * Each entry: [taxableIncome, expectedTax]
   */
  const officialTable: [number, number][] = [
    [10_000, 0],
    [12_000, 0],
    [14_000, 256],
    [16_000, 633],
    [18_000, 1_083],
    [20_000, 1_570],
    [24_000, 2_587],
    [28_000, 3_660],
    [32_000, 4_787],
    [36_000, 5_971],
    [40_000, 7_209],
    [44_000, 8_503],
    [48_000, 9_852],
    [52_000, 11_257],
    [56_000, 12_717],
    [60_000, 14_233],
    [65_000, 16_205],
    [70_000, 18_264],
    [75_000, 20_364],
    [80_000, 22_464],
    [100_000, 30_864],
  ];

  it.each(officialTable)('zvE = %i€ → ESt = %i€', (income, expectedTax) => {
    const result = calculator.calculate(
      input(income),
      noDeductions,
      germanyFormula,
      'DE'
    );
    expect(result).toBe(expectedTax);
  });
});
