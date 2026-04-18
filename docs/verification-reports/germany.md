# Tax Data Verification: Germany 🇩🇪

**Date**: 2026-03-16
**Tax Year**: 2026 (effective January 1, 2026)
**Source(s)**:

- [Bundesministerium der Finanzen (BMF) - Einkommensteuertarif 2026]
- User-provided 2026 Einkommenssteuertabelle with marginal rates

**Status**: ✅ Updated and Current

## Income Tax (Einkommensteuertarif)

Germany's income tax uses a progressive continuous mathematical curve defined in **§32a EStG**, rather than flat brackets. The application implements this calculation exactly using the `formula` tax calculation strategy, accurately replicating the official polynomial curve for the 2026 tax year.

| Taxable Base (zvE) | Calculation Method                        | Note                       |
| ------------------ | ----------------------------------------- | -------------------------- |
| €0 - €12,348       | € 0                                       | Grundfreibetrag (Tax-Free) |
| €12,349 - €17,005  | Linear progressive curve (multiplier + Y) | Progression Zone I         |
| €17,006 - €66,760  | Standard progressive curve (parabolic)    | Progression Zone II        |
| €66,761 - €277,825 | Flat marginal rate (42%)                  | Spitzensteuersatz          |
| €277,826 and above | Maximum marginal rate (45%)               | Reichensteuer              |

> [!TIP]
> The application uses a strictly typed generic `FormulaStrategy` to securely handle these polynomial ranges. The final tax result matches the official tax tables identically, rounding down to the nearest Euro as dictated by German tax protocol.

## Deductions (Freibeträge)

| Field                             | 2026 Official Value | Status |
| --------------------------------- | ------------------- | ------ |
| Personal amount (Grundfreibetrag) | 12,348              | ✅     |
| Children type                     | per_child_year      | ✅     |
| Children income limit             | null                | ✅     |
| Child amount (Kinderfreibetrag)   | 9,756               | ✅     |

> [!IMPORTANT]
> **Offsetting Personal Deduction:** While the UI displays the €12,348 `Grundfreibetrag` explicitly as a "Personal Deduction" for clarity to the user, the core `TaxCalculator` is conceptually aware that formula-based taxes natively embed this baseline at 0%. Therefore, the internal tax calculation uses `Gross Income` – `Children Deduction` to prevent double-dipping the tax-free minimum, ensuring precision with official government BMF output.

## Consumption Taxes (MwSt)

| Field    | Official Value | Status |
| -------- | -------------- | ------ |
| VAT rate | 19%            | ✅     |

## Summary

The tax configuration in `src/data/countries/germany.json` has been successfully verified and updated. It perfectly aligns with the official **2026 tax year** legislative changes and relies entirely on exact formula extraction rather than tier approximations.
