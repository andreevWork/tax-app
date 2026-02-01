import { describe, expect, it } from 'vitest';
import {
  FlatStrategy,
  IncomeTaxCalculator,
  ProgressiveStrategy,
} from '../income';
import type { IncomeTax } from '../income/types';

const calculator = new IncomeTaxCalculator();

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

      const result = calculator.calculate(100_000, taxes);

      expect(result).toBe(10_000);
    });

    it('returns 0 when taxable income is 0', () => {
      const taxes: IncomeTax = {
        type: 'progressive',
        brackets: [{ max: null, rate: 0.2 }],
      };

      const result = calculator.calculate(0, taxes);

      expect(result).toBe(0);
    });

    it('returns 0 for unknown tax type', () => {
      const taxes = {
        type: 'unknown',
        brackets: [{ max: null, rate: 0.2 }],
      } as unknown as IncomeTax;

      const result = calculator.calculate(100_000, taxes);

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

      const result = calculator.calculate(120_000, taxes);

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

      const result = calculator.calculate(50_000, taxes);

      expect(result).toBe(5_000);
    });

    it('handles flat tax with empty brackets', () => {
      const taxes: IncomeTax = {
        type: 'flat',
        brackets: [],
      };

      const result = calculator.calculate(100_000, taxes);

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

      expect(customCalculator.calculate(100_000, taxes)).toBe(15_000);
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
