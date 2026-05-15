import type { TaxesResult, CalculatorInput } from './types';
import type { CountryTaxConfig } from './types';
import { ConsumptionTaxCalculator } from './consumption';
import { DeductionCalculator } from './deductions';
import { IncomeTaxCalculator } from './income';
import { PostTaxAdjustmentCalculator } from './postAdjustments';

export class TaxCalculator {
  private readonly deductionCalculator: DeductionCalculator;
  private readonly incomeTaxCalculator: IncomeTaxCalculator;
  private readonly consumptionTaxCalculator: ConsumptionTaxCalculator;
  private readonly postTaxAdjustmentCalculator: PostTaxAdjustmentCalculator;

  constructor(
    deductionCalculator: DeductionCalculator,
    incomeTaxCalculator: IncomeTaxCalculator,
    consumptionTaxCalculator: ConsumptionTaxCalculator,
    postTaxAdjustmentCalculator: PostTaxAdjustmentCalculator = new PostTaxAdjustmentCalculator()
  ) {
    this.deductionCalculator = deductionCalculator;
    this.incomeTaxCalculator = incomeTaxCalculator;
    this.consumptionTaxCalculator = consumptionTaxCalculator;
    this.postTaxAdjustmentCalculator = postTaxAdjustmentCalculator;
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

    const rawIncomeTax = this.incomeTaxCalculator.calculate(
      inputs,
      deductions,
      country.incomeTax,
      country.countryCode
    );

    const familyBenefit = this.computeFamilyBenefit(
      inputs,
      deductions,
      rawIncomeTax,
      country
    );

    const incomeTax = this.postTaxAdjustmentCalculator.calculate(
      rawIncomeTax,
      inputs,
      country.postTaxAdjustments ?? []
    );

    const consumptionTax = this.consumptionTaxCalculator.calculate(
      inputs,
      country.consumptionTaxes
    );

    const totalTax = incomeTax + consumptionTax;
    const netIncome = inputs.gross - totalTax;
    const effectiveTaxRate = inputs.gross === 0 ? 0 : totalTax / inputs.gross;

    return {
      deductions: { ...deductions, familyBenefit },
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

  private computeFamilyBenefit(
    inputs: CalculatorInput,
    deductions: ReturnType<DeductionCalculator['calculate']>,
    rawIncomeTax: number,
    country: CountryTaxConfig
  ): number | undefined {
    if (country.countryCode !== 'FR' || inputs.childrenCount === 0) {
      return undefined;
    }

    const taxWithNoChildren = this.incomeTaxCalculator.calculate(
      { ...inputs, childrenCount: 0 },
      deductions,
      country.incomeTax,
      country.countryCode
    );

    return taxWithNoChildren - rawIncomeTax;
  }
}
