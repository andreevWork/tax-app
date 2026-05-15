# Project Architecture

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
│   └── income/                # Income tax strategies (progressive, flat, unique)
│       └── strategies/
│           ├── common/        # Universal strategies (FlatStrategy, ProgressiveStrategy)
│           ├── countries/     # Country-specific strategies (GermanyFormulaStrategy, FranceFamilyQuotientStrategy) — all with type='unique'
│           ├── utils/         # Shared helpers (applyBrackets)
│           ├── index.ts       # Barrel + defaultIncomeTaxStrategies registry
│           └── types.ts       # IncomeTaxStrategy interface
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
   - `IncomeTaxCalculator` - Dispatches to an `IncomeTaxStrategy` by `incomeTax.type`. For `type === 'unique'` (country-specific math), the strategy is resolved by `countryCode` instead
   - `ConsumptionTaxCalculator` - Handles VAT/GST/Sales Tax via strategy pattern

Input: `CalculatorInput` (gross income, children count, married status, consumption)
Output: `TaxesResult` (deductions, taxes, totals with effective rate)

### Income Tax Strategies

Income tax uses the strategy pattern. Each strategy implements `IncomeTaxStrategy` from `src/domain/taxes/income/strategies/types.ts` and is registered in `defaultIncomeTaxStrategies` (in `strategies/index.ts`).

Strategies are organized by reusability:

- **`common/`** — universal strategies applicable to many countries:
  - `ProgressiveStrategy` — standard progressive brackets (US, UK, RU when progressive, etc.)
  - `FlatStrategy` — single flat rate (e.g. Russia, Serbia)
- **`countries/`** — country-specific tax models that don't fit the common patterns. They all share the discriminator `type: 'unique'` in JSON; the strategy is resolved at runtime by `countryCode`. Each strategy declares `readonly type = 'unique'` and `readonly countryCode = '<ISO>'` and defines its own narrow config interface co-located with the class:
  - `GermanyFormulaStrategy` (`countryCode = 'DE'`) — § 32a EStG continuous polynomial formula. Config: `GermanyFormulaConfig`
  - `FranceFamilyQuotientStrategy` (`countryCode = 'FR'`) — quotient familial (parts fiscales + cap). Config: `FranceFamilyQuotientConfig`
- **`utils/`** — shared helpers (e.g. `applyBrackets` for bracket math reused by Progressive and FranceFamilyQuotient)

**When to add a strategy to `common/` vs `countries/`:** put it in `common/` only if the math is country-agnostic and likely to be reused by ≥2 countries. Otherwise put it in `countries/`; the central `IncomeTaxType` does NOT grow — only the `defaultIncomeTaxStrategies` registry and the country's JSON file gain entries.

**Why `'unique'` instead of country-code discriminators:** `IncomeTaxType` stays stable at `'progressive' | 'flat' | 'unique'` regardless of how many country-specific strategies are added. The trade-off is one internal `as never` cast in `IncomeTaxCalculator` at the dispatch boundary — strategies remain fully typed via their own narrow config interfaces.

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
