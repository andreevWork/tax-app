# Tax Data Verification: Russia 🇷🇺

**Date**: 2026-03-14
**Tax Year**: 2025+ (effective January 1, 2025)
**Source(s)**:

- [ФНС России — ставки НДФЛ](https://www.nalog.gov.ru/rn77/taxation/taxes/ndfl/) (via browser)
- [ФНС России — ставки НДС](https://www.nalog.gov.ru/rn77/taxation/taxes/nds/) (via browser)
- Web search across consultant.ru, nalog.gov.ru, awaragroup.com, and others

**Status**: ❌ Updates needed

## Income Tax

| Field           | Current Value | Official Value | Status |
| --------------- | ------------- | -------------- | ------ |
| Type            | progressive   | progressive    | ✅     |
| Bracket 1: max  | 2,500,000     | 2,400,000      | ❌     |
| Bracket 1: rate | 13%           | 13%            | ✅     |
| Bracket 2: max  | 50,000,000    | 5,000,000      | ❌     |
| Bracket 2: rate | 15%           | 15%            | ✅     |
| Bracket 3: max  | ∞ (null)      | 20,000,000     | ❌     |
| Bracket 3: rate | 20%           | 18%            | ❌     |
| Bracket 4: max  | — (missing)   | 50,000,000     | ❌     |
| Bracket 4: rate | — (missing)   | 20%            | ❌     |
| Bracket 5: max  | — (missing)   | ∞ (null)       | ❌     |
| Bracket 5: rate | — (missing)   | 22%            | ❌     |

> [!CAUTION]
> The app has **3 brackets** but the official 2025 scale has **5 brackets**. The first bracket threshold is also wrong (2,500,000 vs 2,400,000). This is a significant data error affecting tax calculations.

## Deductions

| Field           | Current Value     | Official Value    | Status |
| --------------- | ----------------- | ----------------- | ------ |
| Personal amount | 0                 | 0                 | ✅     |
| Children type   | per_child_monthly | per_child_monthly | ✅     |
| Income limit    | 450,000/year      | 450,000/year      | ✅     |
| Child 1 amount  | 1,400             | 1,400             | ✅     |
| Child 2 amount  | 2,800             | 2,800             | ✅     |
| Child 3+ amount | 6,000             | 6,000             | ✅     |

## Consumption Taxes

| Field    | Current Value | Official Value | Status |
| -------- | ------------- | -------------- | ------ |
| VAT rate | 20%           | 20%            | ✅     |

## Summary

The deductions and VAT data are ✅ **correct and up to date** with the 2025 tax reform.

The income tax brackets have **critical mismatches**: the app uses the old 3-bracket system while Russia switched to a 5-tier progressive scale on January 1, 2025. The first bracket threshold is also slightly off (2.5M vs 2.4M).

### Proposed fix for [russia.json](file:///Users/tanykos/Development/projects/tax/tax-app/src/data/countries/russia.json)

```diff
 {
   "countryCode": "RU",
   "name": "Russia",
   "currency": "RUB",
   "incomeTax": {
     "type": "progressive",
     "brackets": [
-      { "max": 2500000, "rate": 0.13 },
-      { "max": 50000000, "rate": 0.15 },
-      { "max": null, "rate": 0.2 }
+      { "max": 2400000, "rate": 0.13 },
+      { "max": 5000000, "rate": 0.15 },
+      { "max": 20000000, "rate": 0.18 },
+      { "max": 50000000, "rate": 0.20 },
+      { "max": null, "rate": 0.22 }
     ]
   },
```
