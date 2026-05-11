import { describe, expect, it } from 'vitest';
import { FamilyQuotientStrategy, IncomeTaxCalculator } from '../income';
import type { IncomeTax } from '../income/types';
import type { CalculatorInput } from '../types';
import type { DeductionsResult } from '../deductions/types';

const frBrackets: IncomeTax = {
  type: 'family_quotient',
  brackets: [
    { max: 11600, rate: 0 },
    { max: 29579, rate: 0.11 },
    { max: 84577, rate: 0.3 },
    { max: 181917, rate: 0.41 },
    { max: null, rate: 0.45 },
  ],
  capPerHalfPart: 1807,
};

const noDeductions: DeductionsResult = {
  personal: 0,
  children: 0,
  totalDeductions: 0,
};

function input(
  gross: number,
  isMarried: boolean,
  childrenCount: number
): CalculatorInput {
  return { gross, isMarried, childrenCount };
}

const calculator = new IncomeTaxCalculator();

describe('FamilyQuotientStrategy', () => {
  it('has correct type', () => {
    expect(new FamilyQuotientStrategy().type).toBe('family_quotient');
  });

  describe('single taxpayer, no children — 1 part', () => {
    it('applies brackets to full gross', () => {
      // 30_000: 0% on 11600 + 11% on 17979 + 30% on 421 = 2103.99
      const result = calculator.calculate(
        input(30_000, false, 0),
        noDeductions,
        frBrackets
      );
      expect(result).toBeCloseTo(2103.99, 1);
    });

    it('returns 0 for income in zero bracket', () => {
      const result = calculator.calculate(
        input(10_000, false, 0),
        noDeductions,
        frBrackets
      );
      expect(result).toBe(0);
    });
  });

  describe('married, no children — 2 parts', () => {
    it('splits income across 2 parts', () => {
      // gross = 60_000, income per part = 30_000
      // tax per part = 2103.99, total = 4207.98
      const result = calculator.calculate(
        input(60_000, true, 0),
        noDeductions,
        frBrackets
      );
      expect(result).toBeCloseTo(4207.98, 1);
    });
  });

  describe('france.md reference example — married, 2 children, 90_000 EUR', () => {
    it('matches official high-level result of 9593.98 EUR before décote', () => {
      // Official calculation from france.md:
      // 3 parts (2 married + 0.5×2 children)
      // tax per part on 30_000 = 2103.99
      // taxWithTotalParts = 2103.99 × 3 = 6311.97
      // taxWithBaseParts (2 parts on 45_000 each) = 6603.99 × 2 = 13207.98
      // rawBenefit = 13207.98 - 6311.97 = 6896.01
      // maxBenefit = 1807 × 2 half-parts = 3614
      // finalTax = 13207.98 - 3614 = 9593.98
      const result = calculator.calculate(
        input(90_000, true, 2),
        noDeductions,
        frBrackets
      );
      expect(result).toBeCloseTo(9593.98, 1);
    });
  });

  describe('cap mechanics', () => {
    it('does not apply cap when benefit is within limit', () => {
      // Low income — child benefit will be small, under cap
      const withChildren = calculator.calculate(
        input(25_000, true, 2),
        noDeductions,
        frBrackets
      );
      const withoutChildren = calculator.calculate(
        input(25_000, true, 0),
        noDeductions,
        frBrackets
      );
      // Benefit should be less than 1807 × 2 = 3614
      expect(withoutChildren - withChildren).toBeLessThan(3614);
    });

    it('applies cap when benefit exceeds 1807 per half-part', () => {
      // High income — the reference example proves the cap fires
      const result = calculator.calculate(
        input(90_000, true, 2),
        noDeductions,
        frBrackets
      );
      // Without cap it would be 6311.97; with cap it's 9593.98
      expect(result).toBeGreaterThan(6311);
      expect(result).toBeCloseTo(9593.98, 1);
    });
  });

  describe('third child — adds 1 full part (2 half-parts)', () => {
    it('gives more benefit for 3 children than 2', () => {
      const twoKids = calculator.calculate(
        input(90_000, true, 2),
        noDeductions,
        frBrackets
      );
      const threeKids = calculator.calculate(
        input(90_000, true, 3),
        noDeductions,
        frBrackets
      );
      expect(threeKids).toBeLessThan(twoKids);
    });
  });
});
