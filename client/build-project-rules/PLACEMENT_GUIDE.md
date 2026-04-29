# Component Placement Guide

This project uses the Atomic Design methodology for organizing React components. Place your files according to the following rules:

## Folders

- **atoms/**: Smallest, reusable UI elements (e.g., buttons, toggles, icons).
- **molecules/**: Groups of atoms functioning together (e.g., form fields, navigation items).
- **organisms/**: Complex UI sections composed of molecules and atoms (e.g., Sidebar, Header, Terminal).
- **templates/**: Page-level layout structures (optional, for reusable layouts).
- **pages/**: Top-level route components (optional, for routed views/pages).

## Placement Rules

- Place each component in the folder matching its complexity and reusability.
- If a component is reused in multiple places, prefer a lower-level folder (e.g., atom or molecule).
- Use PascalCase for component filenames (e.g., `ThemeButton.tsx`).
- Co-locate component-specific styles or assets with the component file if needed.
- Add an `index.ts` file for barrel exports if the folder contains multiple components.

## Example

- `atoms/ThemeButton.tsx`
- `molecules/CommandButton.tsx`
- `organisms/Sidebar.tsx`

## Linting & Formatting

- The project enforces code style with ESLint and Prettier (see project root for config).
- Run `npm run lint` and `npm run format` before committing.

---

For questions, ask the project maintainer.
