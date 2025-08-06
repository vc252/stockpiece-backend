import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from 'eslint-plugin-import';

export default defineConfig([
  { ignores: ["dist/"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { 
      js,
      import : eslintPluginImport
    },
    extends: ["js/recommended"],
    rules: {
      'no-console': ['warn'],
      "no-unused-vars": [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ]
    }
  },
  // {
  //   files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  //   languageOptions: { globals: globals.browser },
  // },
  // ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: { 
      ts: tseslint,
      import: eslintPluginImport
    },
    extends: tseslint.configs.recommended,
    rules: {
      "@typescript-eslint/no-unused-vars": [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ],
      'import/extensions': ['error', 'always', {
        js: 'always',
        ts: 'never'
      }]
    }
  },
  {
    files: ["tests/**/*.ts"],
    plugins: { 
      ts: tseslint,
      import: eslintPluginImport
    },
    extends: tseslint.configs.recommended,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        }
      ],
      'import/extensions': ['error', 'always', {
        js: 'always',
        ts: 'never'
      }]
    }
  },
  {
    files: ["src/**/*.ts"],
    plugins: { eslintPluginImport },
    extends: []
  },
  eslintConfigPrettier,
]);
