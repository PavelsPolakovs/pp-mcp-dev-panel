const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  // TypeScript/React/JSX files: use TS parser
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: ['./client/tsconfig.json', './server/tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        React: true,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react'),
      'jsx-a11y': require('eslint-plugin-jsx-a11y'),
      import: require('eslint-plugin-import'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    rules: {
      'no-extra-semi': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: ['./client/tsconfig.json', './server/tsconfig.json'],
        },
      },
    },
  },
  // JS files: use default parser
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        React: true,
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      'jsx-a11y': require('eslint-plugin-jsx-a11y'),
      import: require('eslint-plugin-import'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    rules: {
      'no-extra-semi': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: ['./client/tsconfig.json', './server/tsconfig.json'],
        },
      },
    },
  },
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'dist/**',
      'client/dist/**',
      'server/dist/**',
      '*.config.*',
      'vite.config.*',
      'postcss.config.*',
      'tailwind.config.*',
      '*.d.ts',
    ],
  },
  // Suppress require() rule for config files
  {
    files: ['eslint.config.*', '*.config.*'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:jsx-a11y/recommended'),
  ...compat.extends('plugin:import/recommended'),
  ...compat.extends('plugin:react-hooks/recommended'),
  require('eslint-config-prettier'),
];
