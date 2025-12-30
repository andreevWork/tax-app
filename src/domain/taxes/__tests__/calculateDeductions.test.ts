import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ChildrenDeductionCalculator,
  DeductionCalculator,
  PerChildMonthlyStrategy,
} from '../deductions';
import type { Deductions, UserInputs } from '../../../types/taxes';

describe('DeductionCalculator', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const baseDeductions: Deductions = {
    personal: { amount: 10_000 },
    children: {
      type: 'none',
      incomeLimit: null,
      rules: [],
    },
  };

  const baseInputs: UserInputs = {
    gross: 100_000,
    childrenCount: 2,
    isMarried: false,
  };

  const childrenCalculator = new ChildrenDeductionCalculator();
  const calculator = new DeductionCalculator({
    childrenDeductionCalculator: childrenCalculator,
  });

  it('calculates deductions for unmarried user', () => {
    vi.spyOn(childrenCalculator, 'calculate').mockReturnValue(5_000);

    const result = calculator.calculate(baseInputs, baseDeductions);

    expect(result).toEqual({
      personal: 10_000,
      children: 5_000,
      totalDeductions: 15_000,
    });
  });

  it('doubles personal deduction for married user', () => {
    vi.spyOn(childrenCalculator, 'calculate').mockReturnValue(5_000);

    const result = calculator.calculate(
      { ...baseInputs, isMarried: true },
      baseDeductions
    );

    expect(result).toEqual({
      personal: 20_000,
      children: 5_000,
      totalDeductions: 25_000,
    });
  });

  it('creates default children calculator when not provided', () => {
    const defaultCalculator = new DeductionCalculator();
    const result = defaultCalculator.calculate(baseInputs, baseDeductions);

    expect(result.personal).toBe(10_000);
    expect(result.children).toBe(0); // 'none' type
  });
});

describe('ChildrenDeductionCalculator', () => {
  describe('registerStrategy', () => {
    it('allows registering custom strategy', () => {
      const calc = new ChildrenDeductionCalculator({ strategies: [] });
      calc.registerStrategy(new PerChildMonthlyStrategy());

      expect(calc.hasStrategy('per_child_monthly')).toBe(true);
    });
  });

  describe('hasStrategy', () => {
    it('returns true for registered strategy', () => {
      const calc = new ChildrenDeductionCalculator();

      expect(calc.hasStrategy('per_child_monthly')).toBe(true);
      expect(calc.hasStrategy('per_child_year')).toBe(true);
      expect(calc.hasStrategy('none')).toBe(true);
    });

    it('returns false for unregistered strategy', () => {
      const emptyCalc = new ChildrenDeductionCalculator({ strategies: [] });

      expect(emptyCalc.hasStrategy('per_child_monthly')).toBe(false);
    });
  });
});
