export type IncomeTaxType = 'progressive' | 'flat';

export interface TaxBracket {
  max: number | null;
  rate: number;
}

export interface IncomeTax {
  type: IncomeTaxType;
  brackets: TaxBracket[];
}
