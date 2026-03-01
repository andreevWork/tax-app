/**
 * Converts an amount from one currency to another using the provided exchange rates.
 * The exchange rates provided must be relative to a single common base currency (e.g. EUR).
 *
 * @param amount - The numerical amount to convert
 * @param fromCurrency - The currency code of the input amount (e.g. "USD")
 * @param toCurrency - The target currency code to convert to (e.g. "RSD")
 * @param rates - A dictionary of currency codes to exchange rates relative to a base currency
 * @returns The converted amount. Returns original amount if currencies match or rates are missing.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> | null | undefined
): number {
  if (fromCurrency === toCurrency || !rates) {
    return amount;
  }

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) {
    if (import.meta.env.DEV) {
      console.warn(
        `Missing exchange rate for ${fromCurrency} or ${toCurrency}`
      );
    }
    return amount;
  }

  // To convert A to B, we divide by A's rate (converting A to the base currency)
  // and multiply by B's rate (converting base currency to B).
  return amount * (toRate / fromRate);
}
