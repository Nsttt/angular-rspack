---
summary: Release workflow, npm trusted publishing, staged publish, and tag release process.
read_when:
  - Publishing or releasing this package
---

# Release

The release workflow is `.github/workflows/publish.yml`.

It runs the full local gate before publishing:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm build:example:rspack`
- `pnpm build:example:rsbuild`
- `npm pack --dry-run`

The workflow uses npm trusted publishing with GitHub OIDC.
The GitHub environment is `main`, and npm must be configured to trust the
`publish.yml` workflow for this repository.

## Manual Release

Run the `Publish` workflow from GitHub Actions.

Modes:

- `dry-run`: validates `npm publish` without changing the registry.
- `stage`: runs `npm stage publish` with provenance.
- `publish`: runs `npm publish` directly.

The default mode is `stage`.

## Tag Release

Push a tag that matches the package version:

```sh
git tag v0.0.1
git push origin v0.0.1
```

Tag pushes matching `v*` run `stage` mode.
The workflow checks that `GITHUB_REF_NAME` matches `v${package.version}`.

After staging, approve or reject the package from npm with 2FA.
