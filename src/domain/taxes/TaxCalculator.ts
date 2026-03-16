import type { TaxesResult, CalculatorInput } from './types';
import type { CountryTaxConfig } from './types';
import { ConsumptionTaxCalculator } from './consumption';
import { DeductionCalculator } from './deductions';
import { IncomeTaxCalculator } from './income';

export class TaxCalculator {
  private readonly deductionCalculator: DeductionCalculator;
  private readonly incomeTaxCalculator: IncomeTaxCalculator;
  private readonly consumptionTaxCalculator: ConsumptionTaxCalculator;

  constructor(
    deductionCalculator: DeductionCalculator,
    incomeTaxCalculator: IncomeTaxCalculator,
    consumptionTaxCalculator: ConsumptionTaxCalculator
  ) {
    this.deductionCalculator = deductionCalculator;
    this.incomeTaxCalculator = incomeTaxCalculator;
    this.consumptionTaxCalculator = consumptionTaxCalculator;
  }

  calculate(inputs: CalculatorInput, country: CountryTaxConfig): TaxesResult {
    const deductions = this.deductionCalculator.calculate(
      inputs,
      country.deductions
    );

    const taxableIncome = this.computeTaxableIncome(
      inputs.gross,
      deductions.totalDeductions
    );

    // For formula-based tax regimes (like Germany), the personal deduction
    // (Grundfreibetrag) is mathematically built into the progressive formula
    // as the first zero-tax bracket. Since we already subtracted it for the UI
    // display of "Taxable Income", we must calculate the "true" formula base
    // by only subtracting children/other deductions to avoid double-dipping.
    const incomeTaxBase =
      country.incomeTax.type === 'formula'
        ? Math.max(0, inputs.gross - deductions.children)
        : taxableIncome;

    const incomeTax = this.incomeTaxCalculator.calculate(
      incomeTaxBase,
      country.incomeTax
    );

    const consumptionTax = this.consumptionTaxCalculator.calculate(
      inputs,
      country.consumptionTaxes
    );

    const totalTax = incomeTax + consumptionTax;
    const netIncome = inputs.gross - totalTax;
    const effectiveTaxRate = inputs.gross === 0 ? 0 : totalTax / inputs.gross;

    return {
      deductions,
      taxes: {
        taxableIncome,
        incomeTax,
        consumptionTax,
        totalTax,
      },
      totals: {
        grossIncome: inputs.gross,
        netIncome,
        effectiveTaxRate,
      },
    };
  }

  private computeTaxableIncome(gross: number, totalDeductions: number) {
    return Math.max(0, gross - totalDeductions);
  }
}
