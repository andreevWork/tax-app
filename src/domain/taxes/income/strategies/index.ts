export type { IncomeTaxStrategy } from './types';
export { FlatStrategy } from './FlatStrategy';
export { ProgressiveStrategy } from './ProgressiveStrategy';

import { FlatStrategy } from './FlatStrategy';
import { ProgressiveStrategy } from './ProgressiveStrategy';
import type { IncomeTaxStrategy } from './types';

export const defaultIncomeTaxStrategies: IncomeTaxStrategy[] = [
  new ProgressiveStrategy(),
  new FlatStrategy(),
];
