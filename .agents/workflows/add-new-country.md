---
description: Add a new country to the tax calculator using official government data
---

# /add-new-country

Add a new country to the tax calculator including its configuration JSON, registering it in constants, and fetching its specific official data.

## Usage

The user specifies which country to add. Examples:

- `/add-new-country` France
- `/add-new-country` United Kingdom
- `/add-new-country` JP

## Steps

1. **Identify the country** from the user's request. If unclear, ask the user.
2. **Read the skill instructions** from `.agents/skills/add-new-country/SKILL.md` for a comprehensive step-by-step methodology.
3. **Read existing documentation** in `docs/ADD_NEW_COUNTRY.md` to understand the exact JSON schema and registration locations.
4. **Gather official tax data** for the current year (income tax brackets/formulas, personal deductions, child deductions, consumption taxes) by using `search_web`, `read_url_content`, or `browser_subagent`.
5. **Create the country JSON data file** in `src/data/countries/[filename].json`.
6. **Register the country** in `src/constants/countries.ts` and `src/data/countries/index.ts`.
7. **Update the verification sources** by adding the newly found URLs and the country mapping to `.agents/skills/verify-tax-data/sources.json`.
8. **Verify** that the application builds successfully (`npm run tsc` and `npm run lint`).
9. **Inform the user** via `notify_user` once the country is fully integrated and tested.
