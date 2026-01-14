export type { ConsumptionTaxStrategy } from './types';
export { GstStrategy } from './GstStrategy';
export { SalesTaxStrategy } from './SalesTaxStrategy';
export { VatStrategy } from './VatStrategy';

import { GstStrategy } from './GstStrategy';
import { SalesTaxStrategy } from './SalesTaxStrategy';
import { VatStrategy } from './VatStrategy';
import type { ConsumptionTaxStrategy } from './types';

export const defaultConsumptionTaxStrategies: ConsumptionTaxStrategy[] = [
  new VatStrategy(),
  new SalesTaxStrategy(),
  new GstStrategy(),
];
