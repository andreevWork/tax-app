---
name: add-new-country
description: Instructions for AI agents on how to accurately add a new country to the tax application.
---

# Skill: Add New Country

This document provides definitive instructions on how to add a new country's tax configuration to the application.

## 1. Gather Required Information

Before writing any code, securely gather the official, up-to-date tax data for the **current tax year**:

- **Income Tax**: Is it progressive (brackets), flat, or formula-based? Get the exact brackets/formulas.
- **Deductions**: What is the standard personal deduction/tax-free allowance? Are there child deductions (per month or per year)? Is there an income limit for child deductions?
- **Consumption Tax**: What are the standard VAT/GST/Sales Tax rates?
- **Metadata**: Determine the ISO-3166-1 alpha-2 country code (e.g., `FR`), country name, ISO-4217 Currency (e.g., `EUR`), and the country's emoji flag.

_Note: Make sure to research thoroughly using official government sources or trusted tax aggregators for the CURRENT year._

## 2. Review the Technical Blueprint

Always read `docs/ADD_NEW_COUNTRY.md` before making file changes. It contains the exact JSON schema required and tells you how to format things like `progressive` vs `flat` taxes, and `per_child_year` vs `none` deductions.

## 3. Create the Configuration JSON

Create `src/data/countries/[country_name_lowercase].json` (e.g., `france.json`).

- Ensure numerical values are exact.
- If the country's income tax uses a formula where the personal deduction is natively integrated (like Germany's Grundfreibetrag), set `"deductions.personal.amount": 0` or keep it matching the standard allowance depending on how the brackets apply. For bracket-based countries (like US/UK), put the exact personal allowance under deductions and ensure the brackets map correctly to taxable income after the deduction.
- Ensure the file runs cleanly through the app's Zod schema validation (`src/domain/taxes/schemas/countrySchema.ts`).

## 4. Register the Country

You must register the new country in exactly two places:

**A. `src/constants/countries.ts`**
Add the new entry to the `COUNTRIES` object:

```typescript
[CODE]: { countryCode: '[CODE]', name: '[Name]', currency: '[CURRENCY]', flag: '[FLAG]' },
```

**B. `src/data/countries/index.ts`**
Add the mapping to the `countryFileMap` mapping the `CountryCode` to the new json filename (without the `.json` extension):

```typescript
[CODE]: '[country_name_lowercase]',
```

## 5. Add Verification Report

Create a new markdown file in `docs/verification-reports/[country_name_lowercase].md`.
Document your sources, the tax year you used, the tax brackets, and any specific quirks about how you modelled the country's tax system (e.g., "The UI shows the personal deduction, but the brackets start after it"). Use the existing reports as templates.

## 6. Update Verification Sources

To ensure the country can be verified in the future via the `/verify-tax-data` command, you must update the sources registry.
Open `.agents/skills/verify-tax-data/sources.json` and add the country's `CountryCode` mapping to its new JSON file alongside the source URLs you used to find the data. This allows other agents to periodically verify the data automatically.

## 7. Verification

Run the standard validation commands:

```bash
npm run tsc --noEmit
npm run lint
npm run test
```

If anything fails (particularly Zod validation during tests for the new JSON), correct it immediately.
