import type { ChildrenDeductionStrategy } from './types';

export class NoneStrategy implements ChildrenDeductionStrategy {
  readonly type = 'none' as const;

  calculate(): number {
    return 0;
  }
}
