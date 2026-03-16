---
description: Verify tax data in the app against official government sources for a specific country
---

# /verify-tax-data

Verify and update tax data for a specific country by comparing app data with official sources.

## Usage

The user specifies which country to verify. Examples:

- `/verify-tax-data` RU
- `/verify-tax-data` DE
- `/verify-tax-data` RS

## Steps

1. **Parse the country code** from the user's request (e.g., `RU`, `DE`, `RS`). If no country is specified, ask the user which country to verify.

2. **Read the skill instructions** from `.agents/skills/verify-tax-data/SKILL.md` for the full verification methodology.

3. **Read the sources registry** from `.agents/skills/verify-tax-data/sources.json` to get the official URLs and data points for the requested country.

4. **Read the current country data** from `src/data/countries/[filename].json` (use the `jsonFile` field from `sources.json`).

5. **Fetch official data** from the source URLs listed for the country. Always ensure you are looking for the data applicable to the **current tax year**. Use `read_url_content` first; fall back to `browser_subagent` if needed.

6. **Compare and generate a diff report** following the template in SKILL.md.

7. **Present results** to the user via `notify_user` with the report artifact in `PathsToReview`.

8. **If mismatches are found**, propose specific JSON changes and ask for confirmation before applying.
