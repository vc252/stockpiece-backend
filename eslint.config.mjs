import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  { ignores: ["dist/"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      'no-console': ['warn'],
      'no-unused-vars': ['warn']
    }
  },
  // {
  //   files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  //   languageOptions: { globals: globals.browser },
  // },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"] 
    }
  },
  eslintConfigPrettier,
]);
