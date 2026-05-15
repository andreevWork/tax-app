import type { TaxBracket } from '../../types';

export function applyBrackets(income: number, brackets: TaxBracket[]): number {
  let rest = income;
  let tax = 0;
  let prevMax = 0;

  for (const bracket of brackets) {
    const currentMax = bracket.max ?? Infinity;
    const span = currentMax - prevMax;
    const incomeInBracket = Math.min(rest, span);

    if (incomeInBracket <= 0) break;

    tax += incomeInBracket * bracket.rate;
    rest -= incomeInBracket;
    prevMax = currentMax;

    if (rest <= 0) break;
  }

  return tax;
}
