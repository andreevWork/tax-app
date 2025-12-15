import { describe, expect, it, vi } from 'vitest';
import type { Country, UserInputs } from '../../../types/taxes';
import { calculateDeductions } from '../calculateDeductions';
import { calculateIncomeTax } from '../calculateIncomeTax';
import { calculateTaxes } from '../calculateTaxes';

vi.mock('../calculateDeductions');
vi.mock('../calculateIncomeTax');

describe('calculateTaxes', () => {
  const mockCountry = {
    deductions: {},
    incomeTax: {},
  } as unknown as Country;

  it('calculates taxes with deductions and income tax', () => {
    const inputs: UserInputs = {
      gross: 100_000,
      childrenCount: 2,
      isMarried: false,
    };

    vi.mocked(calculateDeductions).mockReturnValue({
      personal: 10_000,
      children: 5_000,
      totalDeductions: 15_000,
    });

    vi.mocked(calculateIncomeTax).mockReturnValue(17_000);

    const result = calculateTaxes(inputs, mockCountry);

    expect(calculateDeductions).toHaveBeenCalledWith(
      inputs,
      mockCountry.deductions
    );

    expect(calculateIncomeTax).toHaveBeenCalledWith(
      85_000,
      mockCountry.incomeTax
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
        consumptionTax: 0,
        totalTax: 17_000,
      },
      totals: {
        grossIncome: 100_000,
        netIncome: 83_000,
        effectiveTaxRate: 0.17,
      },
    });
  });

  it('does not allow taxableIncome to be negative', () => {
    const inputs: UserInputs = {
      gross: 10_000,
      childrenCount: 1,
      isMarried: true,
    };

    vi.mocked(calculateDeductions).mockReturnValue({
      personal: 15_000,
      children: 5_000,
      totalDeductions: 20_000,
    });

    vi.mocked(calculateIncomeTax).mockReturnValue(0);

    const result = calculateTaxes(inputs, mockCountry);

    expect(result.taxes.taxableIncome).toBe(0);
    expect(result.totals.netIncome).toBe(10_000);
  });

  it('sets effectiveTaxRate to 0 when gross is 0', () => {
    const inputs: UserInputs = {
      gross: 0,
      childrenCount: 0,
      isMarried: false,
    };

    vi.mocked(calculateDeductions).mockReturnValue({
      personal: 0,
      children: 0,
      totalDeductions: 0,
    });

    vi.mocked(calculateIncomeTax).mockReturnValue(0);

    const result = calculateTaxes(inputs, mockCountry);

    expect(result.totals.effectiveTaxRate).toBe(0);
  });
});
