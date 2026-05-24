import { defineConfig } from '@rsbuild/core';
import { pluginAngular } from 'angular-rspack/rsbuild';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 4201,
  },
  dev: {
    hmr: true,
    liveReload: true,
  },
  plugins: [
    pluginAngular(
      {
        options: {
          root: import.meta.dirname,
          index: './src/index.html',
          browser: './src/main.ts',
          tsConfig: './tsconfig.app.json',
          polyfills: ['zone.js'],
          styles: ['./src/styles.css'],
          assets: [{ glob: '**/*', input: 'public' }],
          outputPath: {
            base: './dist',
            browser: '.',
          },
          sourceMap: true,
          deleteOutputPath: true,
          devServer: {
            host: '127.0.0.1',
            port: 4201,
            hmr: true,
            liveReload: true,
          },
        },
      },
      {
        production: {
          options: {
            optimization: true,
            outputHashing: 'all',
            sourceMap: false,
          },
        },
        development: {
          options: {
            optimization: false,
            outputHashing: 'none',
          },
        },
      }
    ),
  ],
});
