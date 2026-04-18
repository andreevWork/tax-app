import type { FormulaZone, IncomeTax } from '../types';
import type { IncomeTaxStrategy } from './types';

function sortByUpTo(zones: FormulaZone[]): FormulaZone[] {
  return [...zones].sort((a, b) => {
    if (a.upTo === null) return 1;
    if (b.upTo === null) return -1;
    return a.upTo - b.upTo;
  });
}

export class FormulaStrategy
  implements IncomeTaxStrategy<Extract<IncomeTax, { type: 'formula' }>>
{
  readonly type = 'formula' as const;

  calculate(
    taxableIncome: number,
    taxConfig: Extract<IncomeTax, { type: 'formula' }>
  ): number {
    if (taxableIncome <= 0) return 0;
    if (taxConfig.formulaZones.length === 0) return 0;

    const x = Math.floor(taxableIncome);
    const zones = sortByUpTo(taxConfig.formulaZones);

    for (const zone of zones) {
      const upperBound = zone.upTo ?? Infinity;

      if (x <= upperBound) {
        if (zone.usesVariable) {
          const variable = (x - zone.variableOffset) / zone.variableDivisor;
          return Math.floor((zone.a * variable + zone.b) * variable + zone.c);
        }

        return Math.floor(zone.a * x + zone.b);
      }
    }

    return 0;
  }
}
