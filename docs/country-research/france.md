# Tax System Research: France 🇫🇷

**Date**: 2026-04-17  
**Country Code**: FR  
**Tax Year / Effective Date**: 2026 tax assessment on 2025 income; current legal tax scale (`barème`) effective **2026-02-21** and confirmed by BOFiP update dated **2026-04-07**  
**Status**: Partially confirmed

## Official Sources

- Légifrance, CGI art. 197 (version en vigueur depuis le 21 février 2026): https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051212954
- BOFiP, BOI-IR-LIQ-20-10, version en vigueur du 07/04/2026: https://bofip.impots.gouv.fr/bofip/2491-PGP.html/identifiant%3DBOI-IR-LIQ-20-10-20260407
- BOFiP actualité ACTU-2026-00022 du 07/04/2026: https://bofip.impots.gouv.fr/bofip/14954-PGP.html/ACTU-2026-00022
- Légifrance, CGI art. 194 (quotient familial / nombre de parts): https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000033817781/2021-06-20
- Service-Public.fr, enfant à charge et parts de quotient familial: https://www.service-public.fr/particuliers/vosdroits/F36482/0_3?idFicheParent=F2633
- Légifrance, CGI art. 278 (TVA taux normal): https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000026950057
- Ministère de l'Économie, taux de TVA en vigueur: https://www.economie.gouv.fr/cedef/les-fiches-pratiques/quels-sont-les-taux-de-tva-en-vigueur-en-france-et-dans-lunion

## Human-Readable Overview

France taxes personal income with a **progressive tax scale (`barème`) per fiscal part**, then multiplies the result by the household's number of parts under the **family quotient system (`quotient familial`)**. This means marital status and dependent children affect the tax base through **tax parts**, not through a fixed child deduction.

For the current law in force on **2026-04-17**, the Finance Law for 2026 updated the tax scale (`barème`) used for **2026 tax due on 2025 income**. BOFiP states that this revalorization applies to tax due in 2026 on 2025 income, and article 197 CGI now reflects the new thresholds.

France also applies a **low-tax reduction (`décote`)** for low tax liabilities under article 197 I-4, which further adjusts the final income tax. This is a formula-based correction, not just a generic discount: for the 2026 assessment on 2025 income, the BOFiP states that it applies when gross income tax is below **1,982 EUR** for single taxpayers and **3,277 EUR** for jointly taxed couples, with the amount calculated from a statutory formula. That mechanism is separate from the base progressive scale.

## Income Tax Table

Reference: CGI art. 197, I-1; BOI-IR-LIQ-20-10, II § 40.

| Fraction de revenu imposable par part | Rate |
| ------------------------------------- | ---- |
| Up to 11,600 EUR                      | 0%   |
| 11,600 EUR to 29,579 EUR              | 11%  |
| 29,579 EUR to 84,577 EUR              | 30%  |
| 84,577 EUR to 181,917 EUR             | 41%  |
| Above 181,917 EUR                     | 45%  |

Additional official notes relevant to modeling:

- `CGI art. 197 I-2`: the family quotient benefit cap (`quotient familial`) is **1,807 EUR per half-part** in the general case for the current 2026 assessment.
- `CGI art. 197 I-4`: the low-tax reduction (`décote`) is still part of the statutory calculation. For 2025 income taxed in 2026, BOFiP gives the working formula as:
  - single: `décote = 897 EUR - 45.25% x impôt brut`
  - joint taxation: `décote = 1,483 EUR - 45.25% x impôt brut`

## Deductions / Family Relief

France does **not** use a simple fixed personal allowance plus fixed child deduction model for ordinary household taxation.

| Field                                   | Official treatment                                                                                                                                                                   | App-model fit          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| Personal deduction / tax-free allowance | No fixed tax-free allowance like in some systems; relief is provided through the progressive scale and, for employment income, standard deductions such as the 10% expense deduction | Partial                |
| Child relief                            | Implemented through family quotient (`quotient familial`) tax parts, not a fixed cash deduction                                                                                      | Not directly supported |
| Married filing effect                   | Implemented through joint taxation and number of parts                                                                                                                               | Not directly supported |

Relevant official references:

- `CGI art. 194`: base parts include 1 part for a single taxpayer and 2 parts for a married taxpayer.
- Service-Public child guidance: first child generally adds **1/2 tax part**, second child adds **1/2 tax part**, and from the third child onward each child adds **1 full tax part**.
- BOFiP RSA guidance: employment income is generally reduced by a standard **10% expense deduction** unless the taxpayer opts for actual expenses.

## Consumption Taxes

Reference: CGI art. 278; Ministère de l'Économie TVA guidance.

| Field             | Official value |
| ----------------- | -------------- |
| VAT type          | VAT            |
| Standard VAT rate | 20%            |

France also has reduced and special VAT rates, but the standard nationwide rate is 20%.

## Example Calculation

Example input used for illustration:

- Gross taxable household income: 90,000 EUR
- Filing situation: married couple
- Children: 2
- Official-law household parts: 3 tax parts total
- App-model assumption from the current JSON draft: no family quotient system, no child deduction, and no low-tax reduction (`décote`)

Official legal calculation at a high level:

- Split 90,000 EUR across 3 tax parts under the family quotient system (`quotient familial`): 90,000 / 3 = 30,000 EUR per part
- Tax per part:
  - 0% on the first 11,600 EUR = 0 EUR
  - 11% on the slice from 11,600 EUR to 29,579 EUR
  - Taxed slice: 17,979 EUR
  - Tax on that slice: 17,979 x 0.11 = 1,977.69 EUR
  - 30% on the slice from 29,579 EUR to 30,000 EUR
  - Taxed slice: 421 EUR
  - Tax on that slice: 421 x 0.30 = 126.30 EUR
  - Total per part = 2,103.99 EUR
- Multiply back by 3 tax parts: 2,103.99 x 3 = 6,311.97 EUR
- The tax benefit from the extra child parts is then compared against the statutory cap:
  - Tax for the same household with only 2 parts: 13,207.98 EUR
  - Raw tax benefit from moving from 2 parts to 3 parts: 13,207.98 - 6,311.97 = 6,896.01 EUR
  - Maximum benefit from the extra 2 half-parts for 2 children: 1,807 x 2 = 3,614 EUR
  - Because the raw benefit exceeds the cap, the allowed benefit is limited to 3,614 EUR
  - Official tax after applying the cap: 13,207.98 - 3,614 = 9,593.98 EUR
- Official result shown here is before any low-tax reduction (`décote`) or other adjustments

App-model approximation with the current schema:

- The current France draft JSON gives no personal deduction and no child deduction.
- In the current app logic, `isMarried` only changes the result through `personal.amount`, and that amount is `0` in the draft.
- So the app taxes the full 90,000 EUR as if there were no French family quotient system.
- Approximate app tax:
  - 0% on the first 11,600 EUR = 0 EUR
  - 11% on the slice from 11,600 EUR to 29,579 EUR = 1,977.69 EUR
  - 30% on the slice from 29,579 EUR to 84,577 EUR = 16,499.40 EUR
  - 41% on the slice from 84,577 EUR to 90,000 EUR = 2,223.43 EUR
  - Total = 20,700.52 EUR

Visible difference in this example:

- Official high-level result: 9,593.98 EUR
- App-model approximation: 20,700.52 EUR
- Gap: 11,106.54 EUR

Why the gap exists:

- The legal system uses the family quotient system (`quotient familial`) and caps its benefit.
- The current app schema cannot represent that mechanism.
- The current France draft also does not implement the statutory low-tax reduction (`décote`).

## Modeling Notes

The current app schema can represent only part of the French system:

- It can represent the **base progressive tax scale (`barème`)** as ordinary brackets.
- It cannot represent the **family quotient system (`quotient familial`)** as a part-based household multiplier.
- It cannot represent the statutory **low-tax reduction (`décote`)** correction.
- It cannot represent many France-specific household outcomes that depend on `isMarried` and `childrenCount`.

Because of that, any `FR` country file added under the current schema would be an **approximation**, not a faithful implementation of French household taxation.

## App-Ready JSON Draft Snippet

This snippet is only a **single-part approximation** of the base tax scale (`barème`) plus standard VAT. It is schema-valid, but it does **not** correctly model French married/children outcomes or the low-tax reduction (`décote`).

```json
{
  "countryCode": "FR",
  "name": "France",
  "currency": "EUR",
  "incomeTax": {
    "type": "progressive",
    "brackets": [
      { "max": 11600, "rate": 0 },
      { "max": 29579, "rate": 0.11 },
      { "max": 84577, "rate": 0.3 },
      { "max": 181917, "rate": 0.41 },
      { "max": null, "rate": 0.45 }
    ]
  },
  "deductions": {
    "personal": { "amount": 0 },
    "children": {
      "type": "none",
      "incomeLimit": null,
      "rules": []
    }
  },
  "consumptionTaxes": [{ "type": "vat", "rate": 0.2 }]
}
```

## Confidence Status

**Partially confirmed**

Confirmed from official current sources:

- 2026-assessment income-tax scale (`barème`) thresholds and rates
- family quotient (`quotient familial`) as the core family-relief mechanism
- standard VAT rate of 20%

Unresolved for direct app integration under current schema:

- faithful treatment of married taxpayers
- faithful treatment of children through the family quotient (`quotient familial`)
- low-tax reduction (`décote`) implementation

## Integration Checklist

If you still want to add France under the current approximation model, the relevant files would be:

- `src/data/countries/france.json`
- `src/constants/countries.ts`
- `src/data/countries/index.ts`
- `.agents/skills/verify-tax-data/sources.json`

Recommended product/engineering note before adding `FR`:

- either accept a documented **single-part approximation**, or
- add a new tax strategy that supports the **family quotient system (`quotient familial`)** and post-scale corrections such as the **low-tax reduction (`décote`)**
