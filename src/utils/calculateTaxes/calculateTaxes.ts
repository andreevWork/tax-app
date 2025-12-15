import type { Country, TaxesResult, UserInputs } from '../../types/taxes';
import { calculateDeductions } from './calculateDeductions';
import { calculateIncomeTax } from './calculateIncomeTax';

export function calculateTaxes(
  inputs: UserInputs,
  country: Country
): TaxesResult {
  const { gross } = inputs;
  const deductions = calculateDeductions(inputs, country.deductions);
  const taxableIncome = Math.max(0, gross - deductions.totalDeductions);
  const incomeTax = calculateIncomeTax(taxableIncome, country.incomeTax);
  const consumptionTax = 0; // TODO
  const totalTax = incomeTax + consumptionTax;
  const netIncome = gross - totalTax;
  const effectiveTaxRate = gross === 0 ? 0 : totalTax / gross;

  return {
    deductions: {
      personal: deductions.personal,
      children: deductions.children,
      totalDeductions: deductions.totalDeductions,
    },

    taxes: {
      taxableIncome,
      incomeTax,
      consumptionTax,
      totalTax,
    },

    totals: {
      grossIncome: gross,
      netIncome,
      effectiveTaxRate,
    },
  };
}
