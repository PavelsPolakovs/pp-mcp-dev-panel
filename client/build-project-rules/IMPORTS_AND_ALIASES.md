# Skill: Managing Imports and Aliases in a TypeScript + Vite Project

This guide describes best practices for simplifying imports and using path aliases in a TypeScript React project with Vite. It covers index file usage, alias configuration, refactoring, and troubleshooting.

---

## 1. Use `index.ts` for Folder Exports

- In each component folder (e.g., `molecules`, `organisms`, `atoms`), create an `index.ts` file that re-exports all components:

```ts
// client/src/components/molecules/index.ts
export { default as CommandButton } from './CommandButton'

// client/src/components/organisms/index.ts
export { default as Terminal } from './Terminal'
export { default as Header } from './Header'
export { default as Sidebar } from './Sidebar'

// client/src/components/atoms/index.ts
export { default as ThemeToggle } from './ThemeToggle'
```

- This allows you to import components like:

```ts
import { CommandButton } from '@molecules'
import { Terminal, Header, Sidebar } from '@organisms'
import { ThemeToggle } from '@atoms'
```

---

## 2. Configure Path Aliases

### Vite (`vite.config.ts`)

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@molecules': resolve(__dirname, 'src/components/molecules'),
      '@organisms': resolve(__dirname, 'src/components/organisms'),
      '@atoms': resolve(__dirname, 'src/components/atoms'),
      '@store': resolve(__dirname, 'src/store')
      // Add more as needed
    }
  }
})
```

### TypeScript (`tsconfig.json`)

> **Best practice:** For maximum flexibility, always add both the folder alias and the wildcard alias for each component group.

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@molecules": ["components/molecules"],
      "@molecules/*": ["components/molecules/*"],
      "@organisms": ["components/organisms"],
      "@organisms/*": ["components/organisms/*"],
      "@atoms": ["components/atoms"],
      "@atoms/*": ["components/atoms/*"],
      "@store": ["store"],
      "@store/*": ["store/*"]
      // Add more as needed
    }
  }
}
```

---

## 3. Refactor Imports

- Replace imports like:

```ts
import CommandButton from '@molecules/CommandButton'
import Terminal from '@organisms/Terminal'
import Header from '@organisms/Header'
import Sidebar from '@organisms/Sidebar'
import ThemeToggle from '@atoms/ThemeToggle'
```

- With:

```ts
import { CommandButton } from '@molecules'
import { Terminal, Header, Sidebar } from '@organisms'
import { ThemeToggle } from '@atoms'
```

---

## 4. Troubleshooting

- **IDE not resolving aliases:**
  - Restart your IDE after changing `tsconfig.json`.
  - Ensure your IDE uses the workspace TypeScript version.
- **Vite build errors:**
  - Check that all aliases in `vite.config.ts` and `tsconfig.json` match, including wildcards.
- **Import errors:**
  - Ensure `index.ts` files exist and export all needed components for grouped imports.
  - Make sure both the folder and wildcard aliases are present in `tsconfig.json`.
- **TypeScript errors:**
  - Check for missing or incorrect types in your exports.
  - Make sure all files use `.ts` or `.tsx` extensions and strict typing is enabled.

---

## 5. Best Practices

- Always add both the folder and wildcard alias for each component group in `tsconfig.json`.
- Keep `index.ts` files up to date as you add/remove components.
- Use named exports for clarity and maintainability.
- Prefer grouped named imports for folders with multiple components.
- Keep alias names short and descriptive.
- Document new aliases in this guide as your project grows.
- Use `.ts` for logic and `.tsx` for React components.
- Enable `strict` mode in `tsconfig.json` for maximum type safety.

---

_Last updated: 2026-04-29_
