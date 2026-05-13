---
name: verify-tax-data
description: Verify app tax data against official government sources for a specific country and report differences
---

# Skill: Verify Tax Data

## 1. Input

ISO-3166-1 alpha-2 country code (e.g. `RU`, `DE`, `RS`).

If not provided, ask the user which country to verify.

## 2. Read the Sources Registry

Read `sources.json` from this skill's directory (`.claude/skills/verify-tax-data/sources.json`).

Find the entry for the requested country. This gives you:

- `jsonFile` — the country's data file name
- `sources` — official URLs to check, in priority order
- `dataPoints` — what to look for on each page (in the country's native language)

If the country is not in `sources.json`, stop and tell the user it is not supported yet. Suggest running `/research-country-tax [CODE]` first.

## 3. Read Current App Data

Read `src/data/countries/[jsonFile]` (use `countryFileMap` in `src/data/countries/index.ts` to confirm the filename).

Extract all verifiable fields:

- `incomeTax.type` and each bracket (`max`, `rate`)
- `deductions.personal.amount`
- `deductions.children.type`, `incomeLimit`, `rules`
- Each `consumptionTaxes` entry (`type`, `rate`)

## 4. Fetch Official Data

For each source URL from `sources.json`:

1. Try **WebFetch** first
2. If the page requires JavaScript or content is insufficient, use **Playwright MCP** (`browser_navigate` → `browser_snapshot`)

Focus on the data points listed in `sources.json → dataPoints`. Sources are in the country's native language — extract numeric values regardless of language.

Always confirm which **tax year** the data applies to. Note if it is the current year or a future year not yet in effect.

## 5. Compare and Classify

| Status        | Meaning                                 |
| ------------- | --------------------------------------- |
| ✅ Match      | Values are identical                    |
| ❌ Mismatch   | Values differ — record both old and new |
| ⚠️ Unverified | Could not confirm from any source       |

## 6. Write the Verification Report

Create `docs/verification-reports/[country_name_lowercase].md`:

```markdown
# Tax Data Verification: [Country Name] [Flag]

**Date**: [today]
**Tax year**: [year verified]
**Sources checked**: [list of URLs]
**Status**: [✅ All current / ❌ Updates needed / ⚠️ Partially verified]

## Income Tax

| Field          | App Value | Official Value | Status |
| -------------- | --------- | -------------- | ------ |
| Type           | ...       | ...            | ✅     |
| Bracket 1 max  | ...       | ...            | ...    |
| Bracket 1 rate | ...       | ...            | ...    |

## Deductions

| Field           | App Value | Official Value | Status |
| --------------- | --------- | -------------- | ------ |
| Personal amount | ...       | ...            | ...    |
| Children type   | ...       | ...            | ...    |

## Consumption Taxes

| Field    | App Value | Official Value | Status |
| -------- | --------- | -------------- | ------ |
| VAT rate | ...       | ...            | ...    |

## Summary

[Brief summary. If mismatches: list them clearly.]
```

## 7. Propose Updates

If any ❌ mismatches found:

1. Show the exact JSON diff for the country file
2. **Ask user confirmation** before applying changes
3. After user confirms, apply the changes and run `npm test`

## Important Notes

- App uses **annual** amounts — convert monthly values (`× 12`) if needed
- Rates in JSON are **decimal fractions** (`0.13` for 13%), not percentages
- Tax data typically changes at the start of a calendar year — note when rates take effect
- If a source is ambiguous or contradicts another, flag as ⚠️ Unverified — do not guess
