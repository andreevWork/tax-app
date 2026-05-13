---
name: research-country-tax
description: Research official tax data for a country and produce a human-readable report ready for app onboarding
---

# Skill: Research Country Tax

## 1. Input

ISO-3166-1 alpha-2 country code (e.g. `RU`, `DE`, `FR`).

If missing, ask the user before proceeding.

## 2. Scope of Research

Collect data for the **current tax year** (mark effective date if upcoming year is already published):

- Income tax model and parameters
- Personal deduction / tax-free allowance
- Child deduction / child-related tax relief
- Consumption taxes (VAT / GST / sales tax)
- Country metadata required by the app data model

## 3. Source Requirements

Use **WebSearch** and **WebFetch** to find official sources in the country's **native language**:

1. National tax authority portal
2. Official legal code / statute publications
3. Official finance ministry publications

Rules:

- At least 2 independent official sources for key numeric values
- Record exact references (article, section, paragraph) where available
- If legal text is ambiguous, note the ambiguity — do **not** guess
- Define local tax terms in plain language at first mention

## 4. Normalization for App Model

Read `docs/ADD_NEW_COUNTRY.md` and `src/domain/taxes/schemas/countrySchema.ts` before mapping values.

| App field                         | Notes                                            |
| --------------------------------- | ------------------------------------------------ |
| `incomeTax.type`                  | `progressive` or `flat`                          |
| `incomeTax.brackets`              | annual `max` thresholds + decimal `rate`         |
| `deductions.personal.amount`      | annual amount                                    |
| `deductions.children.type`        | `none`, `per_child_monthly`, or `per_child_year` |
| `deductions.children.incomeLimit` | annual cap if applicable                         |
| `consumptionTaxes`                | array of `{ type, rate }`                        |

Conversion rules:

- Percent → decimal: 13% → `0.13`
- Monthly → annual where the app requires annual values
- Preserve legal precision — do not round unless the source is rounded

## 5. Report Output

Create `docs/country-research/[country-slug].md`:

```
# [Country Name] [Flag] — Tax Research

**Date**: [today]
**Tax year**: [year]
**Sources**: [list with URLs]

## Tax System Overview
[Plain-language summary, 2–4 paragraphs]

## Income Tax
[Table: brackets/rates as they appear in law]

## Deductions
[Table: personal allowance, child deductions with income limits]

## Consumption Taxes
[Table: VAT/GST/sales tax rates]

## Example Calculation
[At least 1 worked example with concrete input values.
Show every intermediate step (bracket-by-bracket or formula).
If the app model diverges from the legal system, show BOTH results:
  - "Legal calculation" — official result
  - "App approximation" — labeled clearly
Choose an example where any numeric divergence is visible.]

## Modeling Notes
[How legal rules were mapped to the app schema. Note any simplifications.]

## App-Ready JSON Draft
[JSON snippet matching docs/ADD_NEW_COUNTRY.md exactly]

## Verification Confidence
- [ ] Confirmed — all values from ≥2 official sources
- [ ] Partially confirmed — list unresolved points
```

## 6. Existing vs New Country

**Country already exists** in `src/data/countries/`:

- Add mismatch table: Current app value vs. Official value
- Propose exact JSON patch
- Ask user confirmation before applying any changes

**New country** — include integration checklist:

- [ ] Create `src/data/countries/[slug].json`
- [ ] Register in `src/constants/countries.ts`
- [ ] Register in `src/data/countries/index.ts`
- [ ] Add entry to `.claude/skills/verify-tax-data/sources.json`

Note: `docs/country-research/` is for research and onboarding. `docs/verification-reports/` is reserved for the `verify-tax-data` skill.

## 7. Validation After Edits

If any code/data files were changed:

```bash
npm run lint
npm test -- --run
npm run build
```

## 8. Quality Bar

- Separate confirmed facts from assumptions
- Keep language understandable for non-lawyers
- Never invent missing numbers — mark as "not found"
- Cite exact article/section identifiers when available
- The worked example must use concrete numbers and be manually verifiable
- If the country has a modeling gap, the example must make that gap visible
