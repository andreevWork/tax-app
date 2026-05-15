export { IncomeTaxCalculator } from './IncomeTaxCalculator';
export type { IncomeTaxCalculatorOptions } from './IncomeTaxCalculator';

export {
  defaultIncomeTaxStrategies,
  FranceFamilyQuotientStrategy,
  FlatStrategy,
  GermanyFormulaStrategy,
  ProgressiveStrategy,
  type IncomeTaxStrategy,
} from './strategies';

export type {
  FamilyQuotientConfig,
  FormulaZone,
  IncomeTax,
  IncomeTaxType,
  TaxBracket,
} from './types';
