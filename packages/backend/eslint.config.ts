import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslint from '@eslint/js';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    plugins: {
      'unused-imports': pluginUnusedImports
    },
    rules: {
      // 💣 Remove unused imports (auto-fixable)
      'unused-imports/no-unused-imports': 'warn',

      // 🧼 Optionally remove unused vars (but allow unused function args starting with _)
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-empty-interface': ['warn', { allowSingleExtends: true }],
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
);