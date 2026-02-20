import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const API_URL = 'https://api.frankfurter.app/latest?from=EUR';
const OUTPUT_PATH = path.join(
  import.meta.dirname,
  '..',
  '..',
  'public',
  'exchange-rates.json'
);

async function downloadRates() {
  try {
    console.log('🌐 Fetching rates from Frankfurter.dev...');

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Frankfurter data format example:
    // {
    //   "amount": 1,
    //   "base": "EUR",
    //   "date": "2024-01-15",
    //   "rates": { ... }
    // }

    // Adding our metadata
    const enrichedData = {
      ...data,
      last_updated: new Date().toISOString(),
      next_update: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      source: 'Frankfurter.dev (European Central Bank data)',
      disclaimer: 'For informational purposes only',
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(enrichedData, null, 2));

    console.log('✅ Successfully downloaded rates!');
    console.log(`📅 Date: ${data.date}`);
    console.log(`💰 Base currency: ${data.base}`);
    console.log(`📊 Rates for ${Object.keys(data.rates).length} currencies`);
    console.log(`📁 Saved to: ${OUTPUT_PATH}`);

    // File size check
    const stats = fs.statSync(OUTPUT_PATH);
    console.log(`📦 File size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('❌ Failed to download rates:', error.message);

    const fallbackData = {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString(),
      rates: null,
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(fallbackData, null, 2));
    console.log('⚠️ Created fallback file with error info');

    process.exit(1);
  }
}

downloadRates();
