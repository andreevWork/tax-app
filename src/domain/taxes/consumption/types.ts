export type ConsumptionTaxType = 'vat' | 'sales_tax' | 'gst';

export interface ConsumptionTax {
  type: ConsumptionTaxType;
  rate: number;
}
