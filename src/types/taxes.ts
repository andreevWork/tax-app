import { COUNTRIES } from '../constants/countries';

export type CountryKey = keyof typeof COUNTRIES;
export type CountryCode = (typeof COUNTRIES)[CountryKey]['countryCode'];
export type CountryName = (typeof COUNTRIES)[CountryKey]['name'];
export type CountryCurrency = (typeof COUNTRIES)[CountryKey]['currency'];
export type Period = 'year' | 'month';

// ===== Income Taxes =====
export type IncomeTaxType = 'progressive' | 'flat';

export interface TaxBracket {
  max: number | null;
  rate: number;
}

export interface IncomeTax {
  type: IncomeTaxType;
  brackets: TaxBracket[];
}

// ===== Deductions =====
export interface PersonalDeduction {
  amount: number;
}

export type ChildrenDeductionType =
  | 'per_child_monthly'
  | 'benefit_monthly'
  | 'none';

export interface IncomeLimit {
  amount: number;
  period: Period;
}

export type ChildIndex = number | 'all';

export interface ChildDeductionRule {
  childIndex: ChildIndex;
  amount: number;
}

export interface ChildrenDeduction {
  type: ChildrenDeductionType;
  incomeLimit: IncomeLimit | null;
  rules: ChildDeductionRule[];
}

// ===== Consumption Taxes =====
export type ConsumptionTaxType = 'vat';

export interface ConsumptionTax {
  type: ConsumptionTaxType;
  rate: number;
}

// ===== Country =====
export interface Country {
  countryCode: CountryCode;
  name: CountryName;
  currency: CountryCurrency;

  incomeTax: IncomeTax;
  deductions: {
    personal: PersonalDeduction;
    children: ChildrenDeduction;
  };

  consumptionTaxes: ConsumptionTax[];
}

export interface CountriesData {
  countries: Country[];
}
