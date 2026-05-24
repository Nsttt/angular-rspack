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

See `example/rspack` and `example/rsbuild` for complete Angular apps:

```sh
pnpm --filter angular-rspack-rspack-example build
pnpm --filter angular-rspack-rsbuild-example build
```

For Angular workspace metadata, the package reads `angular.json` or `workspace.json`. Set `ANGULAR_RSPACK_WORKSPACE_ROOT` when running from outside the workspace root, and `ANGULAR_RSPACK_PROJECT` to select a project explicitly.

## Publishing

`.github/workflows/publish.yml` runs the full gate, builds both examples, checks the package tarball, then publishes through npm trusted publishing. The workflow uses the `main` GitHub environment.

Manual runs support three modes:

- `dry-run`: validates the npm publish without changing the registry.
- `stage`: runs `npm stage publish` so the package can be reviewed and approved later with 2FA.
- `publish`: runs `npm publish` directly.

Tag pushes matching `v*` run the `stage` mode. The tag must match the package version, for example `v0.0.1`.

After staging, approve or reject the package from npm with 2FA.
