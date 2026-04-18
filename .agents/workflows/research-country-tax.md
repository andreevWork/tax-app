---
description: Research official tax data for a country by code and generate a human-readable report ready for country onboarding
---

# /research-country-tax

Research a country's tax system using official sources in the country's native language and produce a report suitable for adding that country to this app.

## Usage

The user provides the ISO-3166-1 alpha-2 country code.

Examples:

- /research-country-tax RU
- /research-country-tax DE
- /research-country-tax RS

## Steps

1. Parse the country code from the request and normalize to uppercase (for example, RU). If missing, ask the user to provide it.
2. Read the methodology from .agents/skills/research-country-tax/SKILL.md first, then read .agents/skills/add-new-country/SKILL.md and docs/ADD_NEW_COUNTRY.md to align output with the app schema.
3. Determine country metadata from official or trusted references:
   - Country name (English + local language where available)
   - ISO currency code
   - Emoji flag
   - Current tax year applicability
4. Find official tax sources in the country's native language. Prioritize:
   - Government tax authority portals
   - National tax code / law text publications
   - Official ministry publications
     Use at least 2 independent official sources for key rates and thresholds.
5. Extract and normalize values required by the app model:
   - Income tax type (progressive, flat, or formula mapped to supported model)
   - Income tax brackets (max, rate)
   - Personal deduction amount
   - Children deduction type, income limit, and rules
   - Consumption tax entries (vat, gst, sales_tax with decimal rates)
6. Convert all extracted values to app format:
   - Annual amounts where required by the app
   - Decimal fractions for rates (13% -> 0.13)
   - Explicitly document assumptions if legal text cannot be represented exactly
7. Create a human-readable research report at docs/country-research/[country-slug].md with this structure:
   - Header: date, country code, tax year, source links
   - Tax system overview in plain language
   - Income tax table (current legal values)
   - Deductions table
   - Consumption taxes table
   - Example calculation with concrete numbers and explicit intermediate steps; if the app model diverges from the legal system, pick a scenario where the numeric difference is clearly visible
   - Modeling notes for this app (how legal rules were mapped)
   - App-ready draft JSON snippet matching docs/ADD_NEW_COUNTRY.md
   - Verification confidence: Confirmed / Partially confirmed with reasons
8. If a country already exists in src/data/countries, include a mismatch table (Current app value vs Official value) and propose an exact patch, then ask user confirmation before editing. Keep the research write-up in `docs/country-research/`; reserve `docs/verification-reports/` for the `/verify-tax-data` workflow.
9. If the country does not exist yet, include a ready-to-apply integration checklist:
   - Create src/data/countries/[country-slug].json
   - Register in src/constants/countries.ts
   - Register in src/data/countries/index.ts
   - Add sources entry in .agents/skills/verify-tax-data/sources.json
10. Before completion, run validation if code/data files were changed:
    - npm run lint
    - npm test -- --run
    - npm run build

## Output Requirements

- Prefer source text in the native language for legal references and include short translated explanations.
- Clearly separate confirmed facts from assumptions.
- Always cite exact article/section identifiers when available.
- Keep wording understandable for a non-lawyer while preserving numeric precision.
- Explain important local tax terms in plain language at first mention, while keeping the original term available in parentheses when useful.
