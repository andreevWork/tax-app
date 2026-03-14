---
name: verify-tax-data
description: Verify and update tax data in the application against official government sources for a specific country.
---

# Verify Tax Data Skill

## Purpose

Compare current tax data in `src/data/countries/*.json` against official government sources and generate a diff report. The user specifies which country to verify.

## Supported Countries

Read the sources registry from `sources.json` (located in this skill's directory) to determine which URLs to check for each country.

## Verification Procedure

### Step 1: Read Current App Data

Read the country's JSON file from `src/data/countries/` (use `countryFileMap` in `src/data/countries/index.ts` to find the filename).

Extract all verifiable fields:

- `incomeTax.type` and `incomeTax.brackets` (each bracket's `max` and `rate`)
- `deductions.personal.amount`
- `deductions.children.type`, `incomeLimit`, and `rules`
- `consumptionTaxes` (each entry's `type` and `rate`)

### Step 2: Fetch Official Data

Read `sources.json` from this skill's directory to get the list of URLs for the requested country.

For each source URL:

1. First try `read_url_content` to fetch the page
2. If the page requires JavaScript or the content is insufficient, use `browser_subagent` to navigate and extract data
3. Search the page for the specific data points listed in `sources.json` → `dataPoints`

**Important**: Sources are in the country's native language. Extract numerical values (rates, amounts, thresholds) regardless of language.

### Step 3: Compare Data

For each data point, compare the app's current value against the official source value.

Classification:

- ✅ **Match** — values are identical
- ❌ **Mismatch** — values differ (include both old and new)
- ⚠️ **Unverified** — could not find or confirm from source

### Step 4: Generate Report

Create a markdown report in the artifact directory with the following structure:

```markdown
# Tax Data Verification: [Country Name] [Flag]

**Date**: [current date]
**Source(s)**: [list of URLs checked]
**Status**: [✅ All current / ❌ Updates needed / ⚠️ Partially verified]

## Income Tax

| Field           | Current Value | Official Value | Status |
| --------------- | ------------- | -------------- | ------ |
| Type            | progressive   | progressive    | ✅     |
| Bracket 1: max  | 2,400,000     | 2,400,000      | ✅     |
| Bracket 1: rate | 13%           | 13%            | ✅     |
| ...             | ...           | ...            | ...    |

## Deductions

| Field           | Current Value     | Official Value    | Status |
| --------------- | ----------------- | ----------------- | ------ |
| Personal amount | 0                 | 0                 | ✅     |
| Children type   | per_child_monthly | per_child_monthly | ✅     |
| ...             | ...               | ...               | ...    |

## Consumption Taxes

| Field    | Current Value | Official Value | Status |
| -------- | ------------- | -------------- | ------ |
| VAT rate | 20%           | 20%            | ✅     |

## Summary

[Brief summary of findings. If there are mismatches, list them clearly and offer to update the JSON file.]
```

### Step 5: Propose Updates (if needed)

If mismatches are found:

1. Show the exact diff for the country JSON file
2. Ask the user for confirmation before applying changes
3. After updating, remind the user to run `npm test` to validate via Zod schema

## Important Notes

- Tax data changes typically happen at the start of a calendar year
- Always note the **tax year** the data applies to (current year vs. next year)
- Some countries publish new rates before they take effect — clarify which year the rates are for
- The app uses **annual** amounts for brackets and deductions; convert monthly values if needed (multiply by 12)
- Rates in JSON are **decimal fractions** (e.g., 0.13 for 13%), not percentages
