import type { ExchangeRatesResponse } from '../types/types';

export async function fetchExchangeRates(): Promise<ExchangeRatesResponse> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}exchange-rates.json`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
  }

  const data = (await response.json()) as unknown;
  return data as ExchangeRatesResponse;
}
