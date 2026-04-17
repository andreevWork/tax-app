# Tax Data Verification: Russia 🇷🇺

**Date**: 2026-04-17
**Tax Year**: 2026 (checked against current law text; article editions effective as of 2026)
**Source(s)**:

- https://www.nalog.gov.ru/rn77/taxation/taxes/ndfl/
- https://www.consultant.ru/document/cons_doc_LAW_28165/3e4bbd6dd9fb5dd4e9394f447653506e1d6fa3a9/ (НК РФ ст. 224)
- https://www.consultant.ru/document/cons_doc_LAW_28165/c100f38376d82fcc23ff72192989c382d6e3a646/ (НК РФ ст. 218)
- https://www.nalog.gov.ru/rn77/taxation/taxes/nds/
- https://www.consultant.ru/document/cons_doc_LAW_28165/35cc6698564adc4507baa31c9cfdbb4f2516d068/ (НК РФ ст. 164)

**Status**: ❌ Updates needed

## Income Tax

| Field           | Current Value | Official Value | Status |
| --------------- | ------------- | -------------- | ------ |
| Type            | progressive   | progressive    | ✅     |
| Bracket 1: max  | 2,400,000     | 2,400,000      | ✅     |
| Bracket 1: rate | 13%           | 13%            | ✅     |
| Bracket 2: max  | 5,000,000     | 5,000,000      | ✅     |
| Bracket 2: rate | 15%           | 15%            | ✅     |
| Bracket 3: max  | 20,000,000    | 20,000,000     | ✅     |
| Bracket 3: rate | 18%           | 18%            | ✅     |
| Bracket 4: max  | 50,000,000    | 50,000,000     | ✅     |
| Bracket 4: rate | 20%           | 20%            | ✅     |
| Bracket 5: max  | ∞ (null)      | ∞ (null)       | ✅     |
| Bracket 5: rate | 22%           | 22%            | ✅     |

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
| VAT rate | 20%           | 22%            | ❌     |

## Summary

Russia income-tax brackets and child-deduction data in the app are aligned with the current legal text.

One mismatch was found for consumption tax:

- The app stores VAT as 20% (`0.2`), while НК РФ ст. 164 (current 2026 edition) specifies the general VAT rate as 22% (`0.22`) for cases not covered by reduced/zero rates.

### Proposed fix for `src/data/countries/russia.json`

```diff
  "consumptionTaxes": [
-    { "type": "vat", "rate": 0.2 }
+    { "type": "vat", "rate": 0.22 }
  ]
```
