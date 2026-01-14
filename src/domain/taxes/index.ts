// Main calculator
export { TaxCalculator, type TaxCalculatorDependencies } from './TaxCalculator';

// Ports
export type {
  ChildrenDeductionCalculatorPort,
  ConsumptionTaxCalculatorPort,
  DeductionCalculatorPort,
  IncomeTaxCalculatorPort,
} from './ports';

// Deductions
export {
  ChildrenDeductionCalculator,
  DeductionCalculator,
  defaultChildrenDeductionStrategies,
  NoneStrategy,
  PerChildMonthlyStrategy,
  PerChildYearStrategy,
  type ChildrenDeductionCalculatorOptions,
  type ChildrenDeductionStrategy,
  type DeductionCalculatorOptions,
} from './deductions';

// Income Tax
export {
  defaultIncomeTaxStrategies,
  FlatStrategy,
  IncomeTaxCalculator,
  ProgressiveStrategy,
  type IncomeTaxCalculatorOptions,
  type IncomeTaxStrategy,
} from './income';

// Consumption Tax
export {
  ConsumptionTaxCalculator,
  defaultConsumptionTaxStrategies,
  GstStrategy,
  SalesTaxStrategy,
  VatStrategy,
  type ConsumptionTaxCalculatorOptions,
  type ConsumptionTaxStrategy,
} from './consumption';

// Schemas
export {
  countriesDataSchema,
  countrySchema,
  safeValidateCountriesData,
  safeValidateCountry,
  validateCountriesData,
  validateCountry,
  type ValidatedCountriesData,
  type ValidatedCountry,
} from './schemas/countrySchema';
