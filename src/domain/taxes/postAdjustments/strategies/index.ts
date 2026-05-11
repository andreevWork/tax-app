export type { PostTaxAdjustmentStrategy } from './types';
export { DecoteStrategy } from './DecoteStrategy';

import { DecoteStrategy } from './DecoteStrategy';
import type { PostTaxAdjustmentStrategy } from './types';

export const defaultPostTaxAdjustmentStrategies: PostTaxAdjustmentStrategy[] = [
  new DecoteStrategy(),
];
