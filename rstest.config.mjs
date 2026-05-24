import { defineConfig } from '@rstest/core';

export default defineConfig({
  testEnvironment: 'node',
  clearMocks: true,
  unstubEnvs: true,
  source: {
    tsconfigPath: './tsconfig.json',
  },
  resolve: {
    alias: {
      'angular-rspack/compiler': './src/compiler/index.ts',
      'angular-rspack/loaders/angular-loader':
        './src/lib/plugins/loaders/angular-transform.loader.ts',
      'angular-rspack/loaders/angular-partial-transform-loader':
        './src/lib/plugins/loaders/angular-partial-transform.loader.ts',
      'angular-rspack/loaders/platform-server-exports-loader':
        './src/lib/plugins/loaders/platform-server-exports.loader.ts',
    },
  },
});
