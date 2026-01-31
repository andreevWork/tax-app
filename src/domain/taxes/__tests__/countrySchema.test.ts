import { describe, expect, it } from 'vitest';
import {
  validateCountry,
  safeValidateCountry,
  countrySchema,
} from '../schemas/countrySchema';

describe('countrySchema', () => {
  const validCountry = {
    countryCode: 'DE',
    name: 'Germany',
    currency: 'EUR',
    incomeTax: {
      type: 'progressive',
      brackets: [
        { max: 10000, rate: 0.1 },
        { max: null, rate: 0.2 },
      ],
    },
    deductions: {
      personal: { amount: 5000 },
      children: {
        type: 'per_child_year',
        incomeLimit: null,
        rules: [{ childIndex: 'all', amount: 1000 }],
      },
    },
    consumptionTaxes: [{ type: 'vat', rate: 0.19 }],
  };

  describe('validateCountry', () => {
    it('validates correct country data', () => {
      const result = validateCountry(validCountry);

      expect(result.countryCode).toBe('DE');
      expect(result.name).toBe('Germany');
    });

    it('throws on invalid country code length', () => {
      expect(() =>
        validateCountry({ ...validCountry, countryCode: 'DEU' })
      ).toThrow();
    });

    it('throws on invalid currency length', () => {
      expect(() =>
        validateCountry({ ...validCountry, currency: 'EU' })
      ).toThrow();
    });

    it('throws on empty name', () => {
      expect(() => validateCountry({ ...validCountry, name: '' })).toThrow();
    });

    it('throws on invalid income tax type', () => {
      expect(() =>
        validateCountry({
          ...validCountry,
          incomeTax: { type: 'invalid', brackets: [] },
        })
      ).toThrow();
    });

    it('throws on empty brackets', () => {
      expect(() =>
        validateCountry({
          ...validCountry,
          incomeTax: { type: 'progressive', brackets: [] },
        })
      ).toThrow();
    });

    it('throws on rate out of range', () => {
      expect(() =>
        validateCountry({
          ...validCountry,
          incomeTax: {
            type: 'flat',
            brackets: [{ max: null, rate: 1.5 }],
          },
        })
      ).toThrow();
    });
  });

  describe('safeValidateCountry', () => {
    it('returns success for valid data', () => {
      const result = safeValidateCountry(validCountry);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countryCode).toBe('DE');
      }
    });

    it('returns error for invalid data', () => {
      const result = safeValidateCountry({ invalid: 'data' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });
  });

  describe('children deduction types', () => {
    it('validates per_child_monthly type', () => {
      const country = {
        ...validCountry,
        deductions: {
          ...validCountry.deductions,
          children: {
            type: 'per_child_monthly',
            incomeLimit: { amount: 50000, period: 'year' },
            rules: [{ childIndex: 1, amount: 100 }],
          },
        },
      };

      const result = validateCountry(country);
      expect(result.deductions.children.type).toBe('per_child_monthly');
    });

    it('validates none type', () => {
      const country = {
        ...validCountry,
        deductions: {
          ...validCountry.deductions,
          children: {
            type: 'none',
            incomeLimit: null,
            rules: [],
          },
        },
      };

      const result = validateCountry(country);
      expect(result.deductions.children.type).toBe('none');
    });

    it('throws on none type with non-empty rules', () => {
      expect(() =>
        validateCountry({
          ...validCountry,
          deductions: {
            ...validCountry.deductions,
            children: {
              type: 'none',
              incomeLimit: null,
              rules: [{ childIndex: 1, amount: 100 }],
            },
          },
        })
      ).toThrow();
    });
  });

  describe('consumption tax types', () => {
    it('validates sales_tax type', () => {
      const country = {
        ...validCountry,
        consumptionTaxes: [{ type: 'sales_tax', rate: 0.08 }],
      };

      const result = validateCountry(country);
      expect(result.consumptionTaxes[0].type).toBe('sales_tax');
    });

    it('validates gst type', () => {
      const country = {
        ...validCountry,
        consumptionTaxes: [{ type: 'gst', rate: 0.05 }],
      };

      const result = validateCountry(country);
      expect(result.consumptionTaxes[0].type).toBe('gst');
    });

    it('validates empty consumption taxes', () => {
      const country = {
        ...validCountry,
        consumptionTaxes: [],
      };

      const result = validateCountry(country);
      expect(result.consumptionTaxes).toHaveLength(0);
    });
  });

  describe('schema exports', () => {
    it('exports countrySchema', () => {
      expect(countrySchema).toBeDefined();
      expect(typeof countrySchema.parse).toBe('function');
    });
  });
});
