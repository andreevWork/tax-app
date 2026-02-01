export type { ChildrenDeductionStrategy } from './types';
export { NoneStrategy } from './NoneStrategy';
export { PerChildMonthlyStrategy } from './PerChildMonthlyStrategy';
export { PerChildYearStrategy } from './PerChildYearStrategy';

import { NoneStrategy } from './NoneStrategy';
import { PerChildMonthlyStrategy } from './PerChildMonthlyStrategy';
import { PerChildYearStrategy } from './PerChildYearStrategy';
import type { ChildrenDeductionStrategy } from './types';

export const defaultChildrenDeductionStrategies: ChildrenDeductionStrategy[] = [
  new PerChildMonthlyStrategy(),
  new PerChildYearStrategy(),
  new NoneStrategy(),
];
