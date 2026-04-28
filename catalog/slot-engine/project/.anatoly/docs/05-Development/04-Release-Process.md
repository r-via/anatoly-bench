# Release Process

> Describes the versioning strategy, release checklist, and publishing workflow for slot-engine.

## Overview

slot-engine uses Semantic Versioning (SemVer) to communicate the nature of each release. Because the package exposes a pure TypeScript game-logic API with no networking or persistence, breaking changes are limited to the public surface defined in `spin()`, `SpinResult`, and related types documented in the [Public API](../04-API-Reference/01-Public-API.md).

The current release version is **0.1.0** (initial development phase). Releases are driven manually — there is no automated CI publish pipeline defined in the project at this time.

## Versioning Scheme

slot-engine follows Semantic Versioning `MAJOR.MINOR.PATCH`:

| Segment | Increment when… |
|---------|-----------------|
| `MAJOR` | A breaking change is made to the public API (e.g. renamed export, changed `SpinResult` field type, removed behaviour) |
| `MINOR` | New backwards-compatible functionality is added (e.g. new optional field on `SpinResult`, additional payline logic) |
| `PATCH` | Backwards-compatible bug fixes with no public API change (e.g. payout math correction, RTP tuning) |

During the **0.x** series, minor-version bumps may contain breaking changes as the API stabilises.

## Release Checklist

The following steps must be completed in order before tagging a release.

### 1. Verify the build passes

The project's build script performs a full TypeScript type-check with no emit:

```bash
npm run build
```

A clean exit (exit code `0`) confirms there are no type errors. Resolve all diagnostics before proceeding.

### 2. Update the version in `package.json`

Edit the `version` field in `package.json` directly:

```json
{
  "name": "slot-engine",
  "version": "0.2.0"
}
```

### 3. Commit the version bump

Stage and commit the `package.json` change with a conventional message:

```bash
git add package.json
git commit -m "chore: bump version to 0.2.0"
```

### 4. Tag the release

Create an annotated Git tag that matches the new version:

```bash
git tag -a v0.2.0 -m "Release v0.2.0"
```

### 5. Push commits and tags

```bash
git push origin main --follow-tags
```

### 6. Publish to npm (when applicable)

> **Note:** `package.json` sets `"private": true` at version 0.1.0. Before publishing to npm, remove or set that field to `false`.

```bash
npm publish --access public
```

Verify the published package immediately:

```bash
npm info slot-engine
```

## Breaking-Change Policy

A change is considered **breaking** if it:

- Removes or renames an exported symbol (`spin`, `SpinResult`, `Bet`, `LineWin`, `Symbol`).
- Changes the type of any field on `SpinResult` in a non-additive way.
- Alters the semantics of `spin()` such that existing callers receive different payouts for identical inputs without a documented RTP adjustment.

Non-breaking additions (new optional fields, new overloads) do not require a major version bump.

## Examples

### Tagging and publishing a patch release

```bash
# 1. Confirm the build is clean
npm run build

# 2. Edit package.json: "version": "0.1.1"

# 3. Commit, tag, and push
git add package.json
git commit -m "chore: bump version to 0.1.1"
git tag -a v0.1.1 -m "Release v0.1.1"
git push origin main --follow-tags

# 4. Publish (after removing "private": true from package.json)
npm publish --access public
```

### Checking the current published version

```bash
npm info slot-engine version
```

## See Also

- [Build and Test](02-Build-and-Test.md)
- [Source Tree](01-Source-Tree.md)
- [Public API](../04-API-Reference/01-Public-API.md)
- [Types and Interfaces](../04-API-Reference/03-Types-and-Interfaces.md)