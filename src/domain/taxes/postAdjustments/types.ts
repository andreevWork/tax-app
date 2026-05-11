export type PostTaxAdjustmentType = 'decote';

export interface DecoteConfig {
  type: 'decote';
  singleThreshold: number;
  jointThreshold: number;
  singleBase: number;
  jointBase: number;
  rate: number;
}

export type PostTaxAdjustment = DecoteConfig;
