---
name: add-new-country
description: Fully integrate a new country into the tax calculator using official government data
---

# Skill: Add New Country

## 1. Gather Required Information

Before writing any code, read:

- `docs/ADD_NEW_COUNTRY.md` — exact JSON schema and registration locations
- `src/domain/taxes/schemas/countrySchema.ts` — Zod validation (source of truth)

Then use **WebSearch** + **WebFetch** to collect current-year data from official government sources (native language preferred):

| Data point          | What to find                                           |
| ------------------- | ------------------------------------------------------ |
| Income tax model    | Progressive (brackets) or flat rate                    |
| Income tax brackets | Annual thresholds + decimal rates                      |
| Personal deduction  | Annual tax-free allowance                              |
| Child deduction     | Type, per-child amounts, income limit                  |
| Consumption tax     | VAT / GST / sales tax standard rate                    |
| Metadata            | ISO-3166-1 alpha-2 code, ISO-4217 currency, emoji flag |

Use at least 2 independent official sources for key numeric values. Record the exact URLs.

## 2. Create the Country JSON

Create `src/data/countries/[country_name_lowercase].json` (e.g. `france.json`).

Key rules:

- All rates as decimal fractions: `0.20` not `20`
- All thresholds and amounts as **annual** values
- If a country's income tax integrates the personal allowance into brackets natively (e.g. Germany's Grundfreibetrag), read the modeling notes in `docs/ADD_NEW_COUNTRY.md` for that case
- The file must pass Zod validation in `src/domain/taxes/schemas/countrySchema.ts`

## 3. Register the Country

**`src/constants/countries.ts`** — add to the `COUNTRIES` object:

```typescript
[CODE]: { countryCode: '[CODE]', name: '[Name]', currency: '[CURRENCY]', flag: '[FLAG]' },
```

**`src/data/countries/index.ts`** — add to `countryFileMap`:

```typescript
[CODE]: '[country_name_lowercase]',
```

## 4. Update Verification Sources

Add the country to `.claude/skills/verify-tax-data/sources.json` so it can be verified in the future. Follow the existing structure:

```json
"[CODE]": {
  "name": "[Country Name]",
  "flag": "[Flag emoji]",
  "language": "[ISO 639-1 language code]",
  "jsonFile": "[country_name_lowercase].json",
  "sources": [
    { "url": "...", "description": "...", "priority": 1 }
  ],
  "dataPoints": {
    "incomeTax": "...",
    "deductions": "...",
    "consumptionTax": "..."
  }
}
```

## 5. Run Validation

```bash
npm run lint
npm test -- --run
npm run build
```

If tests fail (especially Zod validation), fix immediately before reporting done.

## 6. Definition of Done

- [ ] `src/data/countries/[slug].json` created and Zod-valid
- [ ] Registered in `src/constants/countries.ts`
- [ ] Registered in `src/data/countries/index.ts`
- [ ] Sources added to `.claude/skills/verify-tax-data/sources.json`
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
