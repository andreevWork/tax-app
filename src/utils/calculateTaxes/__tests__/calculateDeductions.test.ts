import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Deductions, UserInputs } from '../../../types/taxes';
import * as childrenModule from '../calculateChildrenDeduction';
import { calculateDeductions } from '../calculateDeductions';

describe('calculateDeductions', () => {
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

  it('calculates deductions for unmarried user', () => {
    vi.spyOn(childrenModule, 'calculateChildrenDeduction').mockReturnValue(
      5_000
    );

    const result = calculateDeductions(baseInputs, baseDeductions);

    expect(result).toEqual({
      personal: 10_000,
      children: 5_000,
      totalDeductions: 15_000,
    });
  });

  it('doubles personal deduction for married user', () => {
    vi.spyOn(childrenModule, 'calculateChildrenDeduction').mockReturnValue(
      5_000
    );

    const result = calculateDeductions(
      { ...baseInputs, isMarried: true },
      baseDeductions
    );

    expect(result).toEqual({
      personal: 20_000,
      children: 5_000,
      totalDeductions: 25_000,
    });
  });
});
