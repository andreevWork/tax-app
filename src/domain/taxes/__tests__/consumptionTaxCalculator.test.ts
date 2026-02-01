import { describe, expect, it } from 'vitest';
import {
  ConsumptionTaxCalculator,
  GstStrategy,
  SalesTaxStrategy,
  VatStrategy,
} from '../consumption';
import type { CalculatorInput } from '../types';
import type { ConsumptionTax } from '../consumption/types';

describe('ConsumptionTaxCalculator', () => {
  const calculator = new ConsumptionTaxCalculator();

  const baseInputs: CalculatorInput = {
    gross: 100_000,
    childrenCount: 0,
    isMarried: false,
    consumption: 50_000,
  };

  describe('VAT calculation', () => {
    it('calculates VAT correctly', () => {
      const taxes: ConsumptionTax[] = [{ type: 'vat', rate: 0.2 }];
      const result = calculator.calculate(baseInputs, taxes);
      expect(result).toBe(10_000); // 50_000 * 0.2
    });

    it('handles zero consumption', () => {
      const inputs: CalculatorInput = { ...baseInputs, consumption: 0 };
      const taxes: ConsumptionTax[] = [{ type: 'vat', rate: 0.2 }];
      const result = calculator.calculate(inputs, taxes);
      expect(result).toBe(0);
    });

    it('handles undefined consumption', () => {
      const inputs: CalculatorInput = {
        gross: 100_000,
        childrenCount: 0,
        isMarried: false,
      };
      const taxes: ConsumptionTax[] = [{ type: 'vat', rate: 0.2 }];
      const result = calculator.calculate(inputs, taxes);
      expect(result).toBe(0);
    });
  });

  describe('Sales Tax calculation', () => {
    it('calculates sales tax correctly', () => {
      const taxes: ConsumptionTax[] = [{ type: 'sales_tax', rate: 0.1 }];
      const result = calculator.calculate(baseInputs, taxes);
      expect(result).toBe(5_000); // 50_000 * 0.1
    });
  });

  describe('GST calculation', () => {
    it('calculates GST correctly', () => {
      const taxes: ConsumptionTax[] = [{ type: 'gst', rate: 0.05 }];
      const result = calculator.calculate(baseInputs, taxes);
      expect(result).toBe(2_500); // 50_000 * 0.05
    });
  });

  describe('multiple taxes', () => {
    it('sums multiple consumption taxes', () => {
      const taxes: ConsumptionTax[] = [
        { type: 'vat', rate: 0.2 },
        { type: 'sales_tax', rate: 0.1 },
      ];
      const result = calculator.calculate(baseInputs, taxes);
      expect(result).toBe(15_000); // 50_000 * 0.2 + 50_000 * 0.1
    });
  });

  describe('empty taxes', () => {
    it('returns 0 when no taxes provided', () => {
      const result = calculator.calculate(baseInputs, []);
      expect(result).toBe(0);
    });
  });

  describe('unknown tax type', () => {
    it('skips unknown tax types', () => {
      const taxes = [
        { type: 'unknown', rate: 0.5 },
      ] as unknown as ConsumptionTax[];
      const result = calculator.calculate(baseInputs, taxes);
      expect(result).toBe(0);
    });
  });

  describe('registerStrategy', () => {
    it('allows registering custom strategy', () => {
      const customCalculator = new ConsumptionTaxCalculator({ strategies: [] });
      customCalculator.registerStrategy(new VatStrategy());

      const taxes: ConsumptionTax[] = [{ type: 'vat', rate: 0.15 }];
      const result = customCalculator.calculate(baseInputs, taxes);
      expect(result).toBe(7_500);
    });
  });

  describe('hasStrategy', () => {
    it('returns true for registered strategy', () => {
      expect(calculator.hasStrategy('vat')).toBe(true);
      expect(calculator.hasStrategy('sales_tax')).toBe(true);
      expect(calculator.hasStrategy('gst')).toBe(true);
    });

    it('returns false for unregistered strategy', () => {
      const emptyCalculator = new ConsumptionTaxCalculator({ strategies: [] });
      expect(emptyCalculator.hasStrategy('vat')).toBe(false);
    });
  });
});

describe('Consumption Tax Strategies', () => {
  const baseInputs: CalculatorInput = {
    gross: 100_000,
    childrenCount: 0,
    isMarried: false,
    consumption: 10_000,
  };

  describe('VatStrategy', () => {
    it('calculates VAT', () => {
      const strategy = new VatStrategy();
      expect(strategy.type).toBe('vat');
      expect(strategy.calculate(baseInputs, { type: 'vat', rate: 0.2 })).toBe(
        2_000
      );
    });
  });

  describe('SalesTaxStrategy', () => {
    it('calculates sales tax', () => {
      const strategy = new SalesTaxStrategy();
      expect(strategy.type).toBe('sales_tax');
      expect(
        strategy.calculate(baseInputs, { type: 'sales_tax', rate: 0.08 })
      ).toBe(800);
    });
  });

  describe('GstStrategy', () => {
    it('calculates GST', () => {
      const strategy = new GstStrategy();
      expect(strategy.type).toBe('gst');
      expect(strategy.calculate(baseInputs, { type: 'gst', rate: 0.05 })).toBe(
        500
      );
    });
  });
});
