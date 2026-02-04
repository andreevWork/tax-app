# Non-Negotiable Rules

These rules are **MANDATORY**. No exceptions. No "just this once."

---

## Code Safety

1. **Never delete files without explicit user confirmation.** Always ask first, even if you think it's unused.

2. **Never use `git push --force` or `git reset --hard`.** These destroy history. If you need them, ask the user.

3. **Never commit `.env`, secrets, or credentials.** If a file smells like secrets, stop and ask.

4. **Always run tests before marking work complete.** Green tests = done. Red tests = not done.

5. **Never skip pre-commit hooks** (`--no-verify`). They exist for a reason.

---

## TypeScript & Types

6. **No `any` type.** Use `unknown` and narrow it, or define a proper type.

7. **No type assertions unless absolutely necessary.** If you write `as SomeType`, add a comment explaining why.

8. **No `@ts-ignore` or `@ts-expect-error` without a TODO comment** explaining when it can be removed.

9. **All function parameters and return types must be explicitly typed.** Let inference work inside functions, not at boundaries.

---

## React & Components

10. **No inline styles.** Use CSS Modules (`*.module.css`). Always.

11. **No `index.tsx` barrel files for components.** Name files after the component: `Button.tsx`, not `index.tsx`.

12. **Props interfaces go in the same file as the component.** Don't scatter types across files.

13. **Use semantic HTML.** `<button>` for actions, `<a>` for navigation. Never `<div onClick>`.

14. **All interactive elements need keyboard support.** If you can click it, you can tab to it and press Enter.

15. **No hardcoded user-facing strings.** Prepare for i18n even if not implemented yet.

---

## State & Data

16. **No direct DOM manipulation.** No `document.querySelector`, no `innerHTML`. React owns the DOM.

17. **Business logic stays out of components.** Components render UI. Logic goes in `/domain` or hooks.

18. **Zustand stores are the single source of truth.** Don't duplicate state between stores and components.

19. **Validate all external data with Zod at boundaries.** API responses, URL params, localStorage - trust nothing.

---

## Testing

20. **New features require tests.** No PR without at least one test covering the happy path.

21. **Tests must be independent.** No test should depend on another test's side effects or order.

22. **Name tests like sentences.** `"calculates tax correctly for married couple with 2 children"` not `"test1"`.

23. **Mock external dependencies, not internal modules.** Mock APIs, not your own code.

---

## Code Quality

24. **One component/function per file.** Exception: tightly coupled helper functions.

25. **No magic numbers.** Use named constants. `if (age >= MINIMUM_ADULT_AGE)` not `if (age >= 18)`.

26. **Functions do one thing.** If you're writing "and" in the function name, split it.

27. **Error messages must be actionable.** Tell the user what went wrong AND what to do about it.

---

## Agentic Coding (AI-Specific)

28. **Read before you write.** Always read a file before editing. No exceptions.

29. **Verify changes compile before reporting success.** Run `npm run build` or relevant check.

30. **When unsure, ask.** Don't guess at requirements. A question takes 10 seconds; fixing wrong code takes hours.

31. **DO NOT OVERENGINEER EVER** ideas and code must be simple, you can expect clear instructions, if your confidence score for next actions and overall goal is not clear - ASK for clarification, stop thinking process or code writting. YOU MUST KNOW what you are doing and must know exact path to achieve it with AS LESS CODE changes as possible.

32. **Always verify UI features with Playwright MCP.** After implementing UI changes:
    - Start the dev server (`npm start`)
    - Navigate to the app using `browser_navigate`
    - Verify elements render correctly using `browser_snapshot`
    - Test interactions (clicks, selections, form inputs)
    - Take screenshots as proof of functionality
    - **Always clean up**: close the browser (`browser_close`) and stop background tasks (`TaskStop`) when verification is complete.
