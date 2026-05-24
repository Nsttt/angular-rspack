# angular-rspack

An attempt to make Angular Rspack and Rsbuild plugins with no dependency on Nx.

```ts
import { createConfig } from 'angular-rspack/rspack';

export default createConfig({
  options: {
    browser: './src/main.ts',
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

`angular-rspack/rspack` exposes the raw Rspack config helpers.
`angular-rspack/rsbuild` exposes the Rsbuild plugin.

See `example/` for both:

```sh
pnpm --filter angular-rspack-example build
pnpm --filter angular-rspack-example build:rsbuild
```

For Angular workspace metadata, the package reads `angular.json` or `workspace.json`. Set `ANGULAR_RSPACK_WORKSPACE_ROOT` when running from outside the workspace root, and `ANGULAR_RSPACK_PROJECT` to select a project explicitly.
