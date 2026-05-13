export { IncomeTaxCalculator } from './IncomeTaxCalculator';
export type { IncomeTaxCalculatorOptions } from './IncomeTaxCalculator';

export {
  defaultIncomeTaxStrategies,
  FamilyQuotientStrategy,
  FlatStrategy,
  FormulaStrategy,
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
