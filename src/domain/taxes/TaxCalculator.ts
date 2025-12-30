import type { Country, TaxesResult, UserInputs } from '../../types/taxes';
import { ConsumptionTaxCalculator } from './consumption';
import { DeductionCalculator } from './deductions';
import { IncomeTaxCalculator } from './income';
import type {
  ConsumptionTaxCalculatorPort,
  DeductionCalculatorPort,
  IncomeTaxCalculatorPort,
} from './ports';

export interface TaxCalculatorDependencies {
  deductionCalculator?: DeductionCalculatorPort;
  incomeTaxCalculator?: IncomeTaxCalculatorPort;
  consumptionTaxCalculator?: ConsumptionTaxCalculatorPort;
}

export class TaxCalculator {
  private readonly deductionCalculator: DeductionCalculatorPort;
  private readonly incomeTaxCalculator: IncomeTaxCalculatorPort;
  private readonly consumptionTaxCalculator: ConsumptionTaxCalculatorPort;

  constructor(dependencies: TaxCalculatorDependencies = {}) {
    this.deductionCalculator =
      dependencies.deductionCalculator ?? new DeductionCalculator();
    this.incomeTaxCalculator =
      dependencies.incomeTaxCalculator ?? new IncomeTaxCalculator();
    this.consumptionTaxCalculator =
      dependencies.consumptionTaxCalculator ?? new ConsumptionTaxCalculator();
  }

  calculate(inputs: UserInputs, country: Country): TaxesResult {
    const deductions = this.deductionCalculator.calculate(
      inputs,
      country.deductions
    );

    const taxableIncome = this.computeTaxableIncome(
      inputs.gross,
      deductions.totalDeductions
    );
    const incomeTax = this.incomeTaxCalculator.calculate(
      taxableIncome,
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
