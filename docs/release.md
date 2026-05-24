---
summary: Changesets versioning, npm trusted publishing, staged publish, and tag release process.
read_when:
  - Publishing or releasing this package
---

# Release

Versioning uses Changesets.

Publishing uses npm trusted publishing through `.github/workflows/publish.yml`.

## Gates

Release workflows run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm build:example:rspack`
- `pnpm build:example:rsbuild`
- `npm pack --dry-run`

## Changesets

For user-facing changes, add a changeset:

```sh
pnpm changeset
```

Choose `patch`, `minor`, or `major`, then write the changelog summary.

When changes land on `main`, `.github/workflows/changesets.yml` creates or updates a `chore: version packages` PR. That PR runs `pnpm version-packages`, updates `package.json`, updates `CHANGELOG.md`, and removes consumed changeset files.

Merge the version PR before publishing.

## Publishing

The publish workflow uses npm trusted publishing with GitHub OIDC.
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
