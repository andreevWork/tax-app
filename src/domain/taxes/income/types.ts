export type IncomeTaxType = 'progressive' | 'flat' | 'unique';

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

export interface FamilyQuotientConfig {
  brackets: TaxBracket[];
  capPerHalfPart: number;
}

// Country-specific tax configs share the 'unique' tag at this level. Extra
// fields are opaque here (matches Zod's passthrough() semantics) — their full
// shape is declared next to the per-country strategy that handles them.
export type IncomeTax =
  | { type: 'progressive'; brackets: TaxBracket[] }
  | { type: 'flat'; brackets: TaxBracket[] }
  | { type: 'unique'; [key: string]: unknown };
