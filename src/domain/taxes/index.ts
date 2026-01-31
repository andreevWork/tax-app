// Main calculator
export { TaxCalculator } from './TaxCalculator';

// Domain types
export type {
  CountryTaxConfig,
  CountryCode,
  CountryCurrency,
  CountryName,
} from './types';

// Deductions
export {
  ChildrenDeductionCalculator,
  DeductionCalculator,
  defaultChildrenDeductionStrategies,
  NoneStrategy,
  PerChildMonthlyStrategy,
  PerChildYearStrategy,
  type ChildDeductionRule,
  type ChildIndex,
  type ChildrenDeduction,
  type ChildrenDeductionCalculatorOptions,
  type ChildrenDeductionStrategy,
  type ChildrenDeductionType,
  type Deductions,
  type DeductionsResult,
  type IncomeLimit,
  type NoChildrenDeduction,
  type PerChildMonthlyDeduction,
  type PerChildYearDeduction,
  type Period,
  type PersonalDeduction,
} from './deductions';

// Income Tax
export {
  defaultIncomeTaxStrategies,
  FlatStrategy,
  IncomeTaxCalculator,
  ProgressiveStrategy,
  type IncomeTax,
  type IncomeTaxCalculatorOptions,
  type IncomeTaxStrategy,
  type IncomeTaxType,
  type TaxBracket,
} from './income';

// Consumption Tax
export {
  ConsumptionTaxCalculator,
  defaultConsumptionTaxStrategies,
  GstStrategy,
  SalesTaxStrategy,
  VatStrategy,
  type ConsumptionTax,
  type ConsumptionTaxCalculatorOptions,
  type ConsumptionTaxStrategy,
  type ConsumptionTaxType,
} from './consumption';

// Schemas
export {
  countrySchema,
  safeValidateCountry,
  validateCountry,
  type ValidatedCountry,
} from './schemas/countrySchema';
