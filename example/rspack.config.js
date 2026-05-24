const { createConfig } = require('angular-rspack');

module.exports = createConfig(
  {
    options: {
      root: __dirname,
      index: './src/index.html',
      browser: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      polyfills: ['zone.js'],
      styles: ['./src/styles.css'],
      assets: [{ glob: '**/*', input: 'public' }],
      outputPath: './dist',
      optimization: false,
      outputHashing: 'none',
      sourceMap: {
        scripts: true,
        styles: true,
      },
      devServer: {
        host: '127.0.0.1',
        port: 4200,
        hmr: true,
        open: false,
      },
      deleteOutputPath: true,
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
  }
);
