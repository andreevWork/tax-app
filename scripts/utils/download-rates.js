import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const API_URL = 'https://open.er-api.com/v6/latest/EUR';
const OUTPUT_PATH = path.join(
  import.meta.dirname,
  '..',
  '..',
  'public',
  'exchange-rates.json'
);

async function downloadRates() {
  try {
    console.log('🌐 Fetching rates from Exchangerate-API...');

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // er-api data format example:
    // {
    //   "result": "success",
    //   "base_code": "EUR",
    //   "time_last_update_utc": "...",
    //   "rates": { ... }
    // }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));

    console.log('✅ Successfully downloaded rates!');
    console.log(`📅 Date: ${data.time_last_update_utc}`);
    console.log(`💰 Base currency: ${data.base_code}`);
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
