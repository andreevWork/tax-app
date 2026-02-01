import { describe, expect, it } from 'vitest';
import { ChildrenDeductionCalculator } from '../deductions';
import type { ChildrenDeduction } from '../deductions/types';

const calculator = new ChildrenDeductionCalculator();

describe('ChildrenDeductionCalculator', () => {
  describe('base cases', () => {
    it('returns 0 when deduction type is "none"', () => {
      const result = calculator.calculate(120_000, 2, {
        type: 'none',
        incomeLimit: null,
        rules: [],
      });

      expect(result).toBe(0);
    });

    it('returns 0 when childrenCount is 0', () => {
      const result = calculator.calculate(120_000, 0, {
        type: 'per_child_year',
        incomeLimit: null,
        rules: [{ childIndex: 'all', amount: 1000 }],
      });

      expect(result).toBe(0);
    });
  });

  describe('per_child_year', () => {
    it('calculates yearly deduction for all children', () => {
      const config: ChildrenDeduction = {
        type: 'per_child_year',
        incomeLimit: null,
        rules: [{ childIndex: 'all', amount: 9756 }],
      };

      const result = calculator.calculate(100_000, 4, config);

      expect(result).toBe(4 * 9756);
    });

    it('does not apply yearly deduction when gross exceeds income limit', () => {
      const config: ChildrenDeduction = {
        type: 'per_child_year',
        incomeLimit: { amount: 50_000, period: 'year' },
        rules: [{ childIndex: 'all', amount: 5000 }],
      };

      const result = calculator.calculate(60_000, 2, config);

      expect(result).toBe(0);
    });

    it('applies yearly deduction when gross is below income limit', () => {
      const config: ChildrenDeduction = {
        type: 'per_child_year',
        incomeLimit: { amount: 50_000, period: 'year' },
        rules: [{ childIndex: 'all', amount: 5000 }],
      };

      const result = calculator.calculate(40_000, 2, config);

      expect(result).toBe(10_000);
    });

    it('adds 0 if ruleForAll is absent', () => {
      const config: ChildrenDeduction = {
        type: 'per_child_year',
        incomeLimit: null,
        rules: [{ childIndex: 1, amount: 200 }],
      };

      const result = calculator.calculate(100_000, 4, config);

      expect(result).toBe(200);
    });
  });

  describe('per_child_monthly', () => {
    it('calculates monthly deduction while income is within limit', () => {
      const config: ChildrenDeduction = {
        type: 'per_child_monthly',
        incomeLimit: { amount: 36_000, period: 'year' },
        rules: [
          { childIndex: 1, amount: 200 },
          { childIndex: 2, amount: 300 },
        ],
      };

      const result = calculator.calculate(12_000, 3, config);

      expect(result).toBe(12 * (200 + 300 + 300));
    });

    it('calculates monthly deduction when limit is absent', () => {
      const config: ChildrenDeduction = {
        type: 'per_child_monthly',
        incomeLimit: null,
        rules: [
          { childIndex: 1, amount: 200 },
          { childIndex: 2, amount: 300 },
        ],
      };

      const result = calculator.calculate(12_000, 3, config);

      expect(result).toBe(12 * (200 + 300 + 300));
    });

    it('returns 0 if income limit is too small', () => {
      const config: ChildrenDeduction = {
        type: 'per_child_monthly',
        incomeLimit: { amount: 500, period: 'year' },
        rules: [{ childIndex: 1, amount: 300 }],
      };

      const result = calculator.calculate(24_000, 1, config);

      expect(result).toBe(0);
    });
  });

  describe('unknown deduction type', () => {
    it('returns 0 for unknown deduction type (graceful fallback)', () => {
      const config = {
        type: 'unknown',
        incomeLimit: null,
        rules: [],
      } as unknown as ChildrenDeduction;

      const result = calculator.calculate(50_000, 2, config);

      expect(result).toBe(0);
    });
  });
});
