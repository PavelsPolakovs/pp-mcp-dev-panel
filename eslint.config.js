import { dirname } from 'path'
import { fileURLToPath } from 'url'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default [
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
      '*.d.ts'
    ]
  },

  // TypeScript/React/JSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './client/tsconfig.json', './server/tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
        noWarnOnMultipleProjects: true
      },
      globals: { React: true }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      'import/no-unresolved': ['error', { ignore: ['^@modelcontextprotocol/'] }],
      'comma-dangle': ['error', 'never'],
      semi: ['error', 'never']
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json', './client/tsconfig.json', './server/tsconfig.json']
        }
      }
    }
  },

  // JS/JSX files
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { React: true }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      'no-extra-semi': 'error',
      'comma-dangle': ['error', 'never'],
      semi: ['error', 'never']
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json', './client/tsconfig.json', './server/tsconfig.json']
        }
      }
    }
  },

  // Disable type-aware linting for vite config (not part of a tsconfig project)
  {
    files: ['client/vite.config.ts'],
    languageOptions: {
      parserOptions: { project: null }
    }
  },

  prettierConfig
]
