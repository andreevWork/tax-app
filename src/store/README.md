# State Management Setup with Zustand

## Overview

This document describes the implementation of state management for the project using **Zustand**, a lightweight and flexible state management library for React. Zustand provides a simple API for managing global application state without the complexity of Redux or MobX.

## Why Zustand?

Zustand was chosen for this project because of its:

- **Minimal API**: Simple hooks-based pattern familiar to React developers
- **Lightweight**: No boilerplate code required
- **Performance**: Automatic subscriptions and re-render optimization
- **TypeScript Support**: Full type safety out of the box
- **Easy Testing**: Stores are simple functions, easy to mock and test

## Project Structure

```
src/
├── App.tsx
├── App.module.css
├── main.tsx
└── store/
    ├── index.ts                 # Export point for all stores
    ├── app/
    │   └── useAppStore.ts       # Application state (counter)
    ├── theme/
    │   └── useThemeStore.ts     # Theme and UI state
    └── user/
        └── useUserStore.ts      # User authentication state
```

### Store Organization

Stores are organized by domain/feature to maintain separation of concerns:

- **`app/`**: Application-level state (e.g., counters, general app state)
- **`theme/`**: Theme preferences and UI settings (dark/light mode, sidebar, language)
- **`user/`**: User authentication and profile information

## Stores Documentation

### 1. App Store (`store/app/useAppStore.ts`)

Manages simple application state with a counter example.

**State Interface:**

```typescript
interface AppState {
  count: number;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
}
```

**Usage Example:**

```typescript
import { useAppStore } from './store';

function MyComponent() {
  const { count, increase, decrease, reset } = useAppStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**Initial State:**

- `count`: 0

---

### 2. Theme Store (`store/theme/useThemeStore.ts`)

Manages theme preferences and UI state like sidebar visibility and language settings.

**State Interface:**

```typescript
interface ThemeState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  language: string;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setLanguage: (lang: string) => void;
}
```

**Usage Example:**

```typescript
import { useThemeStore } from './store';

function ThemeToggle() {
  const { theme, toggleTheme, isSidebarOpen, toggleSidebar } = useThemeStore();

  return (
    <div>
      <p>Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <p>Sidebar: {isSidebarOpen ? 'Open' : 'Closed'}</p>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
    </div>
  );
}
```

**Initial State:**

- `theme`: 'dark'
- `isSidebarOpen`: true
- `language`: 'en'

---

### 3. User Store (`store/user/useUserStore.ts`)

Manages user authentication state and profile information.

**State Interface:**

```typescript
interface UserState {
  username: string;
  email: string;
  isLoggedIn: boolean;
  login: (username: string, email: string) => void;
  logout: () => void;
}
```

**Usage Example:**

```typescript
import { useUserStore } from './store';

function UserProfile() {
  const { username, isLoggedIn, login, logout } = useUserStore();

  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>Welcome, {username}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('John', 'john@example.com')}>
          Login
        </button>
      )}
    </div>
  );
}
```

**Initial State:**

- `username`: ''
- `email`: ''
- `isLoggedIn`: false

---

## Store Exports (`store/index.ts`)

All stores are centrally exported from `store/index.ts` for convenient imports throughout the application:

```typescript
export { useAppStore } from './app/useAppStore';
export { useThemeStore } from './theme/useThemeStore';
export { useUserStore } from './user/useUserStore';
```

**Import Pattern:**

```typescript
// Single import statement for all stores
import { useAppStore, useThemeStore, useUserStore } from './store';
```

**New Store Template:**

```typescript
import { create } from 'zustand';

interface NewState {
  // State properties
  value: string;
  // Actions
  setValue: (value: string) => void;
}

export const useNewStore = create<NewState>((set) => ({
  value: '',

  setValue: (value: string) => set({ value }),
}));
```

---

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run start
```

## Example Application

The `App.tsx` component demonstrates the usage of all three stores with interactive examples for each store's functionality.

---

## References

- [Zustand Documentation](https://zustand.docs.pmnd.rs/getting-started/introduction)

```

```
