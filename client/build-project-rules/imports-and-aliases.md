# Skill: Managing Imports and Aliases in a TypeScript + Vite Project

This guide describes best practices for simplifying imports and using path aliases in a TypeScript React project with Vite. It covers index file usage, alias configuration, refactoring, and troubleshooting.

---

## 1. Use `index.ts` for Folder Exports

- In each component folder (e.g., `molecules`, `organisms`), create an `index.ts` file that re-exports all components:

```ts
// client/src/components/molecules/index.ts
export { default as CommandButton } from "./CommandButton";

// client/src/components/organisms/index.ts
export { default as Terminal } from "./Terminal";
export { default as Header } from "./Header";
export { default as Sidebar } from "./Sidebar";
```

- This allows you to import components like:

```ts
import { CommandButton } from "@molecules";
import { Terminal, Header, Sidebar } from "@organisms";
```

---

## 2. Configure Path Aliases

### Vite (`vite.config.ts`)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@molecules': path.resolve(__dirname, 'src/components/molecules'),
      '@organisms': path.resolve(__dirname, 'src/components/organisms'),
      '@store': path.resolve(__dirname, 'src/store'),
      // Add more as needed
    },
  },
});
```

### TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@molecules": ["components/molecules"],
      "@organisms": ["components/organisms"],
      "@store": ["store"],
      // Add more as needed
    }
  }
}
```

---

## 3. Refactor Imports

- Replace imports like:

```ts
import CommandButton from "@molecules/CommandButton";
import Terminal from "@organisms/Terminal";
import Header from "@organisms/Header";
import Sidebar from "@organisms/Sidebar";
```

- With:

```ts
import { CommandButton } from "@molecules";
import { Terminal, Header, Sidebar } from "@organisms";
```

- For default-only folders, you can also do:

```ts
import CommandButton from "@molecules";
```

---

## 4. Troubleshooting

- **IDE not resolving aliases:**
  - Restart your IDE after changing `tsconfig.json`.
  - Ensure your IDE uses the workspace TypeScript version.
- **Vite build errors:**
  - Check that all aliases in `vite.config.ts` and `tsconfig.json` match.
- **Import errors:**
  - Ensure `index.ts` files exist and export all needed components.
- **TypeScript errors:**
  - Check for missing or incorrect types in your exports.

---

## 5. Best Practices

- Keep `index.ts` files up to date as you add/remove components.
- Use named exports for clarity and maintainability.
- Prefer grouped named imports for folders with multiple components.
- Keep alias names short and descriptive.
- Document new aliases in this guide as your project grows.

---

_Last updated: 2026-04-29_
