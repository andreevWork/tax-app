import { describe, expect, it } from 'vitest';
import type { IncomeTax } from '../../../types/taxes';
import { calculateIncomeTax } from '../calculateIncomeTax';

describe('calculateIncomeTax', () => {
  describe('base cases', () => {
    it('returns 0 if tax type is not progressive', () => {
      const taxes: IncomeTax = {
        type: 'flat',
        brackets: [
          { max: 50_000, rate: 0.1 },
          { max: null, rate: 0.2 },
        ],
      };

      const result = calculateIncomeTax(100_000, taxes);

      expect(result).toBe(0);
    });

    it('returns 0 when taxable income is 0', () => {
      const taxes: IncomeTax = {
        type: 'progressive',
        brackets: [{ max: null, rate: 0.2 }],
      };

      const result = calculateIncomeTax(0, taxes);

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

      const result = calculateIncomeTax(120_000, taxes);

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

      const result = calculateIncomeTax(50_000, taxes);

      expect(result).toBe(5_000);
    });
  });
});
