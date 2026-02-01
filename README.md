# Get Started

## Prerequisites

- **nvm** (Node Version Manager) - manages Node.js versions
  - macOS/Linux: https://github.com/nvm-sh/nvm
  - Windows: https://github.com/coreybutler/nvm-windows

## Setup

1. Install and use the correct Node.js version:

   ```bash
   nvm install    # Install the version specified in .nvmrc (first time only)
   nvm use        # Switch to the correct Node.js version
   ```

   > **Note:** Run `nvm use` each time you open a new terminal before running any npm commands.

2. Install recommended VS Code extensions for the project

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the project:
   ```bash
   npm start
   ```

## Tech Stack

- React 19 + TypeScript
- Vite (build tool & dev server)
- CSS Modules

## Development Tools

- **Husky**: Pre-commit hooks for code quality
- **lint-staged**: Runs linters on staged files before commit
- **Prettier**: Code formatting
- **ESLint**: Code linting
- **Auto-formatting**: Format on save enabled in VS Code

## Claude code

For simpler and more transparent billing/models use this setup - https://openrouter.ai/docs/guides/guides/claude-code-integration
