# How to Add a New Country

## Quick Start (2 Steps)

### 1. Add Country Constant

📍 `src/constants/countries.ts`

```typescript
export const COUNTRIES = {
  RU: { countryCode: 'RU', name: 'Russia', currency: 'RUB' },
  DE: { countryCode: 'DE', name: 'Germany', currency: 'EUR' },
  RS: { countryCode: 'RS', name: 'Serbia', currency: 'RSD' },
  // ← Add new country
  US: { countryCode: 'US', name: 'United States', currency: 'USD' },
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

| Field      | Type                        | Description          |
| ---------- | --------------------------- | -------------------- |
| `type`     | `"progressive"` \| `"flat"` | Tax calculation type |
| `brackets` | `TaxBracket[]`              | Tax rates            |

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
US: { countryCode: 'US', name: 'United States', currency: 'USD' },
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

## Adding a New Calculation Type

If you need a new `type` (e.g., `"cantonal"` for Switzerland):

1. Add type to `src/domain/taxes/income/types.ts`:

   ```typescript
   export type IncomeTaxType = 'progressive' | 'flat' | 'cantonal';
   ```

2. Create strategy in `src/domain/taxes/income/strategies/`:

   ```typescript
   // CantonalStrategy.ts
   export class CantonalStrategy implements IncomeTaxStrategy {
     readonly type = 'cantonal' as const;

     calculate(taxableIncome: number, taxes: IncomeTax): number {
       // Calculation logic
     }
   }
   ```

3. Register in `src/domain/taxes/income/strategies/index.ts`:

   ```typescript
   export const defaultIncomeTaxStrategies: IncomeTaxStrategy[] = [
     new ProgressiveStrategy(),
     new FlatStrategy(),
     new CantonalStrategy(), // ← add here
   ];
   ```

4. Update Zod schema in `src/domain/taxes/schemas/countrySchema.ts`:
   ```typescript
   type: z.enum(['progressive', 'flat', 'cantonal']),
   ```
