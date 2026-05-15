# How to Add a New Country

## Quick Start (2 Steps)

### 1. Add Country Constant

📍 `src/constants/countries.ts`

```typescript
export const COUNTRIES = {
  RU: { countryCode: 'RU', name: 'Russia', currency: 'RUB', flag: '🇷🇺' },
  DE: { countryCode: 'DE', name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  RS: { countryCode: 'RS', name: 'Serbia', currency: 'RSD', flag: '🇷🇸' },
  // ← Add new country
  US: { countryCode: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
} as const;
```

### 2. Create Country Data File and Register Mapping

📍 `src/data/countries/usa.json`

```json
{
  "countryCode": "US",
  "name": "United States",
  "currency": "USD",
  "incomeTax": { ... },
  "deductions": { ... },
  "consumptionTaxes": [ ... ]
}
```

📍 `src/data/countries/index.ts`

```typescript
const countryFileMap: Record<CountryCode, string> = {
  RU: 'russia',
  DE: 'germany',
  RS: 'serbia',
  // ← Add mapping
  US: 'usa',
};
```

That's it! The country will automatically appear in the selector and load on demand when selected.

---

## Country Data Structure

### incomeTax

| Field      | Type                                      | Description          |
| ---------- | ----------------------------------------- | -------------------- |
| `type`     | `"progressive"` \| `"flat"` \| `"unique"` | Tax calculation type |
| `brackets` | `TaxBracket[]`                            | Tax rates            |

Strategy implementations live in `src/domain/taxes/income/strategies/`:

- `common/ProgressiveStrategy` handles `progressive`
- `common/FlatStrategy` handles `flat`
- `countries/GermanyFormulaStrategy` handles `unique` for `countryCode === 'DE'` (Germany's § 32a EStG)
- `countries/FranceFamilyQuotientStrategy` handles `unique` for `countryCode === 'FR'` (France's quotient familial)

**Country-specific strategies all use `type: "unique"`** and are resolved by `countryCode` at runtime. This keeps the central `IncomeTaxType` stable (`'progressive' | 'flat' | 'unique'`) regardless of how many country-specific strategies are added — and prevents accidental reuse: if Belgium needs a family quotient with different rules, it gets its own strategy with `countryCode === 'BE'` rather than silently picking up France's math.

**Progressive** — progressive tax scale (each bracket applies to its portion of income):

```json
"incomeTax": {
  "type": "progressive",
  "brackets": [
    { "max": 50000, "rate": 0.1 },   // 10% on income up to 50k
    { "max": 100000, "rate": 0.2 },  // 20% on income 50k-100k
    { "max": null, "rate": 0.3 }     // 30% on everything above 100k
  ]
}
```

**Flat** — flat rate (first bracket applies to entire income):

```json
"incomeTax": {
  "type": "flat",
  "brackets": [
    { "max": null, "rate": 0.13 }    // 13% on entire income
  ]
}
```

---

### deductions

#### personal

```json
"personal": { "amount": 12000 }  // Fixed deduction
```

#### children

**Option 1: `per_child_monthly`** — monthly deduction with income limit

```json
"children": {
  "type": "per_child_monthly",
  "incomeLimit": {
    "amount": 450000,   // Annual income limit
    "period": "year"
  },
  "rules": [
    { "childIndex": 1, "amount": 1400 },  // 1st child: 1400/month
    { "childIndex": 2, "amount": 2800 },  // 2nd child: 2800/month
    { "childIndex": 3, "amount": 6000 }   // 3rd and beyond: 6000/month
  ]
}
```

**Option 2: `per_child_year`** — annual deduction per child

```json
"children": {
  "type": "per_child_year",
  "incomeLimit": null,
  "rules": [
    { "childIndex": "all", "amount": 9756 }  // All children: 9756/year
  ]
}
```

**Option 3: `none`** — no child deductions

```json
"children": {
  "type": "none",
  "incomeLimit": null,
  "rules": []
}
```

---

### consumptionTaxes

```json
"consumptionTaxes": [
  { "type": "vat", "rate": 0.2 },        // VAT 20%
  { "type": "sales_tax", "rate": 0.08 }, // Sales tax 8%
  { "type": "gst", "rate": 0.05 }        // GST 5%
]
```

Supported types: `vat`, `sales_tax`, `gst`

---

## Full Example: United States

### 1. Constant

📍 `src/constants/countries.ts`

```typescript
US: { countryCode: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
```

### 2. Data File

📍 `src/data/countries/usa.json`

```json
{
  "countryCode": "US",
  "name": "United States",
  "currency": "USD",
  "incomeTax": {
    "type": "progressive",
    "brackets": [
      { "max": 11600, "rate": 0.1 },
      { "max": 47150, "rate": 0.12 },
      { "max": 100525, "rate": 0.22 },
      { "max": 191950, "rate": 0.24 },
      { "max": 243725, "rate": 0.32 },
      { "max": 609350, "rate": 0.35 },
      { "max": null, "rate": 0.37 }
    ]
  },
  "deductions": {
    "personal": { "amount": 14600 },
    "children": {
      "type": "per_child_year",
      "incomeLimit": { "amount": 200000, "period": "year" },
      "rules": [{ "childIndex": "all", "amount": 2000 }]
    }
  },
  "consumptionTaxes": [{ "type": "sales_tax", "rate": 0.0 }]
}
```

### 3. Mapping

📍 `src/data/countries/index.ts`

```typescript
const countryFileMap: Record<CountryCode, string> = {
  // ...existing countries
  US: 'usa',
};
```

---

## How It Works

Countries are loaded **dynamically on demand**:

1. `COUNTRIES` constant provides metadata (code, name, currency) for the country selector — available instantly
2. When user selects a country, its full tax configuration is loaded from a separate JSON chunk
3. Each country file is bundled separately (~0.5 KB each)

This approach:

- ✅ Instant country list (no loading state)
- ✅ Loads tax configs only when needed
- ✅ Scales to hundreds of countries

---

## Validation

Country data is automatically validated by Zod schema when the application loads.

If data is invalid, the application will throw a clear error:

```
ZodError: [
  { path: ["countryCode"], message: "String must contain exactly 2 character(s)" }
]
```

---

## Adding a Country-Specific Strategy

If a country needs math that doesn't fit `progressive` or `flat` (e.g., Switzerland's cantonal model), you add a new **strategy**, not a new central type. The country's JSON uses `"type": "unique"` and the strategy is resolved by `countryCode`.

1. Create the strategy in `src/domain/taxes/income/strategies/countries/`. Name the class `<Country><MathName>Strategy` and define its config interface in the same file:

   ```typescript
   // strategies/countries/SwitzerlandCantonalStrategy.ts
   import type { CalculatorInput } from '../../../types';
   import type { DeductionsResult } from '../../../deductions/types';
   import type { IncomeTaxStrategy } from '../types';

   interface SwitzerlandCantonalConfig {
     type: 'unique';
     // ...fields specific to Switzerland's tax config
   }

   export class SwitzerlandCantonalStrategy
     implements IncomeTaxStrategy<SwitzerlandCantonalConfig>
   {
     readonly type = 'unique' as const;
     readonly countryCode = 'CH' as const;

     calculate(
       input: CalculatorInput,
       deductions: DeductionsResult,
       taxConfig: SwitzerlandCantonalConfig
     ): number {
       // Calculation logic — taxConfig is fully typed here
     }
   }
   ```

2. Register in `src/domain/taxes/income/strategies/index.ts` (export + add to `defaultIncomeTaxStrategies`):

   ```typescript
   export { SwitzerlandCantonalStrategy } from './countries/SwitzerlandCantonalStrategy';
   import { SwitzerlandCantonalStrategy } from './countries/SwitzerlandCantonalStrategy';

   export const defaultIncomeTaxStrategies: IncomeTaxStrategy[] = [
     new ProgressiveStrategy(),
     new FlatStrategy(),
     new GermanyFormulaStrategy(),
     new FranceFamilyQuotientStrategy(),
     new SwitzerlandCantonalStrategy(), // ← add here
   ];
   ```

3. In the country's JSON file, use `"type": "unique"`:

   ```json
   "incomeTax": {
     "type": "unique",
     // ...country-specific fields
   }
   ```

4. **No changes needed in `IncomeTaxType`, `IncomeTax`, or `incomeTaxSchema`** — they stay stable. The `'unique'` branch in Zod accepts extra fields via `z.looseObject(...)`, and the strategy itself reads only the fields it expects.

5. If a UI behavior is country-specific (e.g., showing the "married" field only for household-taxation countries), gate it by `countryCode` directly in the hook (see `useCaseSettingsFields.ts` for the FR pattern), not by `incomeTax.type`.
