# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
npm start              # Start dev server (Vite on port 5173)
npm run build          # TypeScript check + Vite production build
npm run lint           # Run ESLint
npm run format:fix     # Auto-fix formatting with Prettier
npm test               # Run unit tests (Vitest)
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
npm run test:e2e       # Run Playwright E2E tests
```

**Run a single test file:**

```bash
npx vitest run src/domain/taxes/__tests__/TaxCalculator.test.ts
```

## Architecture

### Tech Stack

- React 19 + TypeScript 5.9 + Vite 7
- State management: Zustand (hooks-based stores)
- Styling: CSS Modules (co-located `.module.css` files)
- Validation: Zod
- Testing: Vitest (unit) + Playwright (E2E)

### Project Structure

```
src/
├── domain/taxes/       # Tax calculation business logic (strategy pattern)
│   ├── TaxCalculator.ts       # Main orchestrator
│   ├── consumption/           # VAT, GST, Sales Tax strategies
│   ├── deductions/            # Personal/children deduction calculators
│   └── income/                # Progressive tax bracket calculator
├── store/              # Zustand stores organized by domain (app/, theme/, user/, country/, currency/)
├── hooks/              # Adapter hooks that connect stores to presentational components
├── components/         # Reusable presentational UI components with CSS Modules
├── pages/              # Page-level components
├── constants/          # Static constants (countries, popular currencies)
├── data/               # Static country tax configurations
└── api/                # API integration layer
```

### Tax Calculator Architecture

The tax calculation system uses dependency injection with three specialized calculators:

1. **TaxCalculator** - Main orchestrator that coordinates:
   - `DeductionCalculator` - Computes personal and children deductions
   - `IncomeTaxCalculator` - Applies progressive tax brackets
   - `ConsumptionTaxCalculator` - Handles VAT/GST/Sales Tax via strategy pattern

Input: `CalculatorInput` (gross income, children count, married status, consumption)
Output: `TaxesResult` (deductions, taxes, totals with effective rate)

### Component Architecture

Components in `src/components/` follow the **presentational component + adapter hook** pattern:

- **Component** (`ComponentName.tsx`) — Pure UI, receives all data via props, no direct store access
- **Hook** (`src/hooks/useComponentName.ts`) — Connects to Zustand stores, prepares and returns props for the component
- **Page** (`src/pages/`) — Uses the hook and passes props to the component via spread

### State Management

Zustand stores follow the `useXxxStore` naming pattern and are organized by domain:

- Import from `./store` for centralized access
- See `src/store/README.md` for detailed store documentation

## Code Conventions

- **Exported functions must use function declarations**, not arrow functions (ESLint enforced)
- **Strict TypeScript** enabled with `strictTypeChecked` ESLint rules
- **Pre-commit hooks** run Prettier and ESLint on staged files
- Node version: v24+ (specified in `.nvmrc`, use `nvm use` before running commands)
