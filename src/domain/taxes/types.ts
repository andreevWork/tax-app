import { COUNTRIES } from '../../constants/countries';
import type { ConsumptionTax } from './consumption/types';
import type { Deductions, DeductionsResult } from './deductions/types';
import type { IncomeTax } from './income/types';

export type CountryKey = keyof typeof COUNTRIES;
export type CountryCode = (typeof COUNTRIES)[CountryKey]['countryCode'];
export type CountryName = (typeof COUNTRIES)[CountryKey]['name'];
export type CountryCurrency = (typeof COUNTRIES)[CountryKey]['currency'];

export interface CountryTaxConfig {
  countryCode: CountryCode;
  name: CountryName;
  currency: CountryCurrency;

  incomeTax: IncomeTax;
  deductions: Deductions;

  consumptionTaxes: ConsumptionTax[];
}

// ===== Calculator I/O =====
export interface CalculatorInput {
  gross: number;
  childrenCount: number;
  consumption?: number;
  isMarried: boolean;
}

export interface TaxesResult {
  deductions: DeductionsResult;
  taxes: {
    taxableIncome: number;
    incomeTax: number;
    consumptionTax: number;
    totalTax: number;
  };
  totals: {
    grossIncome: number;
    netIncome: number;
    effectiveTaxRate: number;
  };
}
