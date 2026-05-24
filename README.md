# angular-rspack

Standalone Angular Rspack plugin with no Nx runtime dependencies.

```ts
import { createConfig } from 'angular-rspack';

export default createConfig({
  options: {
    browser: './src/main.ts',
  },
});
```

For Angular workspace metadata, the package reads `angular.json` or `workspace.json`. Set `ANGULAR_RSPACK_WORKSPACE_ROOT` when running from outside the workspace root, and `ANGULAR_RSPACK_PROJECT` to select a project explicitly.
