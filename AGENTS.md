# AGENTS.md

Nestor owns this repo.

## Project

- Package: `angular-rspack`
- Goal: Angular Rspack and Rsbuild integration without an Nx dependency.
- Runtime/package manager: pnpm.
- Tests: Rstest.
- Lint: Rslint.

## Commands

- Install: `pnpm install`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Test: `pnpm test`
- Build package: `pnpm build`
- Build Rspack example: `pnpm build:example:rspack`
- Build Rsbuild example: `pnpm build:example:rsbuild`

Before handoff, run:

```sh
pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm build:example:rspack && pnpm build:example:rsbuild
```

Clean generated example output before committing:

```sh
trash example/rspack/dist example/rsbuild/dist 2>/dev/null || true
```

## Source Layout

- `src/lib/rspack.ts`: Rspack entrypoint exports.
- `src/lib/rsbuild.ts`: Rsbuild plugin entrypoint.
- `src/compiler`: Angular compiler integration.
- `example/rspack`: Rspack Angular app.
- `example/rsbuild`: Rsbuild Angular app.
- `docs/release.md`: release process.

## Rspack vs Rsbuild API

- Rspack uses `createConfig()` from `angular-rspack/rspack`.
- Rsbuild uses `pluginAngular()` from `angular-rspack/rsbuild`.
- Do not model Rspack as `plugins: [pluginAngular(...)]` unless Rspack adds earlier config-mutation hooks. Angular needs loaders, entries, output, optimization, and plugins set before Rspack normalizes config.

## Docs

- Run `docs-list` when docs change.
- Keep README informational.
- Put release/process instructions in `docs/release.md`.
- Add front matter to docs:

```yaml
---
summary: Short summary.
read_when:
  - Relevant trigger
---
```

## Release

- GitHub Actions workflow: `.github/workflows/publish.yml`.
- GitHub environment: `main`.
- npm trusted publishing should trust `publish.yml`.
- Default release mode is staged publish: `npm stage publish --provenance`.
- Tag releases use `v${package.version}`.

## Style

- Keep TypeScript type-safe. Avoid `as any` and broad casts.
- Prefer existing helpers/patterns over new abstractions.
- Keep files under roughly 500 LOC; split when useful.
- Do not reintroduce Nx runtime dependencies or references.
- Do not use Vitest/Vite-based local test tooling.

## Git

- Use `committer` for commits.
- Conventional commits.
- Do not commit generated `dist` output.
- Do not push unless explicitly asked.
