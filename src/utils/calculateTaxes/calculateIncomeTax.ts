import type { IncomeTax } from '../../types/taxes';

export function calculateIncomeTax(
  taxableIncome: number,
  taxes: IncomeTax
): number {
  if (taxes.type === 'progressive') {
    let rest = taxableIncome;
    let tax = 0;
    let prevMax = 0;

    for (const bracket of taxes.brackets) {
      const currentMax = bracket.max ?? Infinity;

      const span = currentMax - prevMax;

      const incomeInBracket = Math.min(rest, span);

      if (incomeInBracket <= 0) break;

      tax += incomeInBracket * bracket.rate;

      rest -= incomeInBracket;
      prevMax = currentMax;

      if (rest <= 0) break;
    }

    return Math.max(0, tax);
  } else {
    return 0;
  }
}
