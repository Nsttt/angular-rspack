# angular-rspack

An attempt to make Angular Rspack and Rsbuild plugins with no dependency on Nx.
This project is inspired by the Nx [`@nx/angular-rspack`](https://www.npmjs.com/package/@nx/angular-rspack) package, but is published as a standalone package with no Nx runtime dependency.

## Rspack

```js
const { createConfig } = require('angular-rspack/rspack');

module.exports = createConfig({
  options: {
    browser: './src/main.ts',
    index: './src/index.html',
    tsConfig: './tsconfig.app.json',
  },
});
```

## Rsbuild

```ts
import { defineConfig } from '@rsbuild/core';
import { pluginAngular } from 'angular-rspack/rsbuild';

export default defineConfig({
  plugins: [
    pluginAngular({
      options: {
        browser: './src/main.ts',
        index: './src/index.html',
        tsConfig: './tsconfig.app.json',
      },
    }),
  ],
});
```

`angular-rspack/rspack` exposes Rspack config helpers.
The generated Rspack config includes the Angular Rspack plugin, loaders, entries, and output settings.
`angular-rspack/rsbuild` exposes the Rsbuild plugin.

See `example/rspack` and `example/rsbuild` for complete Angular apps:

```sh
pnpm --filter angular-rspack-rspack-example build
pnpm --filter angular-rspack-rsbuild-example build
```

For Angular workspace metadata, the package reads `angular.json` or `workspace.json`. Set `ANGULAR_RSPACK_WORKSPACE_ROOT` when running from outside the workspace root, and `ANGULAR_RSPACK_PROJECT` to select a project explicitly.
