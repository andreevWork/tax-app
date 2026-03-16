export type IncomeTaxType = 'progressive' | 'flat' | 'formula';

export interface TaxBracket {
  max: number | null;
  rate: number;
}

export interface FormulaZone {
  upTo: number | null;
  a: number;
  b: number;
  c: number;
  variableOffset: number;
  variableDivisor: number;
  usesVariable: boolean;
}

export type IncomeTax =
  | { type: 'progressive'; brackets: TaxBracket[] }
  | { type: 'flat'; brackets: TaxBracket[] }
  | { type: 'formula'; formulaZones: FormulaZone[] };
