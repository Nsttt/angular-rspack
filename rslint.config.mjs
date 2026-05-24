import { defineConfig, ts } from '@rslint/core';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ts.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
