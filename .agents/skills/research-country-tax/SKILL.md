---
name: research-country-tax
description: Research official tax system data for a country and produce a human-readable onboarding report compatible with this app's country schema.
---

# Skill: Research Country Tax

This skill defines the methodology for researching a country's tax system and producing a report that is both easy for humans to review and directly usable for adding the country to this application.

## 1. Input

The user provides an ISO-3166-1 alpha-2 country code (for example, `RU`, `DE`, `RS`).

If the code is missing, ask for it before proceeding.

## 2. Scope of Research

Collect data for the **current tax year** (or clearly mark the effective date if the upcoming year is already published):

- Income tax model and parameters
- Personal deduction / tax-free allowance
- Child deduction / child-related tax relief
- Consumption taxes (VAT / GST / sales tax)
- Country metadata required by app data model

## 3. Source Requirements

Use official sources in the country's native language whenever possible:

1. National tax authority portal
2. Official legal code / statute publications
3. Official finance ministry publications

Rules:

- Prioritize legal text or authority pages over secondary summaries.
- Use at least 2 independent official sources for key numeric values.
- Record exact references (article, section, paragraph) where available.
- If legal text is ambiguous, note the ambiguity explicitly instead of guessing.
- When local legal or tax terms are important, explain them in plain language at first mention instead of leaving them untranslated.

## 4. Normalization for App Model

Map findings to `docs/ADD_NEW_COUNTRY.md` structure:

- `incomeTax.type`: `progressive` or `flat`
- `incomeTax.brackets`: annual thresholds and decimal rates
- `deductions.personal.amount`: annual numeric value
- `deductions.children`: `none`, `per_child_monthly`, or `per_child_year`
- `consumptionTaxes`: array with `vat`, `gst`, or `sales_tax`

Conversion rules:

- Convert percent values to decimals (for example, 13% -> 0.13).
- Convert monthly amounts to annual only where the app model requires annual values.
- Preserve legal precision; do not round unless the source is rounded.

## 5. Report Output

Create `docs/country-research/[country-slug].md` with:

1. Header: date, country code, tax year/effective date, source links
2. Human-readable overview of the tax system
3. Income tax table (official values)
4. Deductions table
5. Consumption tax table
6. Example calculation section:
   - Show at least 1 concrete worked example using explicit input values
   - Include the tax base, bracket-by-bracket or formula-based computation, and final tax result
   - If the legal system cannot be modeled exactly in the current app, show both:
     - the official legal calculation at a high level
     - the app-model approximation, clearly labeled as an approximation
   - When the app model is known to diverge from the legal system, choose an example where the numeric difference is visible rather than an edge case where both results happen to match
7. Modeling notes (how legal rules were adapted to app schema)
8. App-ready JSON draft snippet
9. Confidence status:
   - Confirmed
   - Partially confirmed (with unresolved points)

## 6. Existing vs New Country Handling

If country already exists in `src/data/countries`:

- Add mismatch table: Current app value vs Official value
- Propose exact patch
- Ask user confirmation before applying edits

If country is new:

- Provide integration checklist for:
  - `src/data/countries/[country].json`
  - `src/constants/countries.ts`
  - `src/data/countries/index.ts`
  - `.agents/skills/verify-tax-data/sources.json`

Notes:

- `docs/country-research/` is for research and onboarding analysis, including countries not yet supported by the app.
- `docs/verification-reports/` remains reserved for `/verify-tax-data` style reports that compare an existing in-app country against current official sources.

## 7. Validation After Edits

If any code/data files were changed, run:

```bash
npm run lint
npm test -- --run
npm run build
```

## 8. Quality Bar

- Separate confirmed facts from assumptions.
- Keep language understandable for non-lawyers.
- Do not invent missing numbers.
- Prefer minimal, deterministic output that can be directly reviewed and applied.
- The worked example must use concrete numbers and be easy to recompute manually.
- Do not leave important foreign tax terms unexplained; keep the original term, but add a short plain-language explanation.
- If the country has a known modeling gap, the example should make that gap obvious with different official vs app-model results.
