export type {
  IncomeTaxStrategy,
  AnyIncomeTaxStrategy,
  StrategyMap,
} from './types';

export { FlatStrategy } from './FlatStrategy';
export { FormulaStrategy } from './FormulaStrategy';
export { ProgressiveStrategy } from './ProgressiveStrategy';
export { FamilyQuotientStrategy } from './FamilyQuotientStrategy';

import { FlatStrategy } from './FlatStrategy';
import { FormulaStrategy } from './FormulaStrategy';
import { ProgressiveStrategy } from './ProgressiveStrategy';
import { FamilyQuotientStrategy } from './FamilyQuotientStrategy';
import type { IncomeTaxStrategy } from './types';

export const defaultIncomeTaxStrategies: IncomeTaxStrategy[] = [
  new ProgressiveStrategy(),
  new FlatStrategy(),
  new FormulaStrategy(),
  new FamilyQuotientStrategy(),
];
