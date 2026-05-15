export type { IncomeTaxStrategy } from './types';

export { FlatStrategy } from './common/FlatStrategy';
export { GermanyFormulaStrategy } from './countries/GermanyFormulaStrategy';
export { ProgressiveStrategy } from './common/ProgressiveStrategy';
export { FranceFamilyQuotientStrategy } from './countries/FranceFamilyQuotientStrategy';

import { FlatStrategy } from './common/FlatStrategy';
import { GermanyFormulaStrategy } from './countries/GermanyFormulaStrategy';
import { ProgressiveStrategy } from './common/ProgressiveStrategy';
import { FranceFamilyQuotientStrategy } from './countries/FranceFamilyQuotientStrategy';
import type { IncomeTaxStrategy } from './types';

export const defaultIncomeTaxStrategies: IncomeTaxStrategy[] = [
  new ProgressiveStrategy(),
  new GermanyFormulaStrategy(),
  new FlatStrategy(),
  new FranceFamilyQuotientStrategy(),
];
