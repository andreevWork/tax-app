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
  | 'per_child_year'
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

// ===== Children Deduction (Discriminated Union) =====
interface BaseChildrenDeduction {
  incomeLimit: IncomeLimit | null;
  rules: ChildDeductionRule[];
}

export interface PerChildMonthlyDeduction extends BaseChildrenDeduction {
  type: 'per_child_monthly';
}

export interface PerChildYearDeduction extends BaseChildrenDeduction {
  type: 'per_child_year';
}

export interface NoChildrenDeduction {
  type: 'none';
  incomeLimit: null;
  rules: [];
}

export type ChildrenDeduction =
  | PerChildMonthlyDeduction
  | PerChildYearDeduction
  | NoChildrenDeduction;

export interface Deductions {
  personal: PersonalDeduction;
  children: ChildrenDeduction;
}

// ===== Consumption Taxes =====
export type ConsumptionTaxType = 'vat' | 'sales_tax' | 'gst';

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
  deductions: Deductions;

  consumptionTaxes: ConsumptionTax[];
}

export interface CountriesData {
  countries: Country[];
}

// ===== User Inputs =====
export interface UserInputs {
  gross: number;
  childrenCount: number;
  consumption?: number;
  isMarried: boolean;
}

// ===== User Output =====
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

export interface DeductionsResult {
  personal: number;
  children: number;
  totalDeductions: number;
}
