# Build and Test

> Reference for all build, type-check, and test commands available in slot-engine.

## Overview

slot-engine uses the TypeScript compiler (`tsc`) as its sole build tool and `tsx` as a lightweight runtime for executing TypeScript files directly. There is no bundler, no separate emit step, and no dedicated test framework — the `package.json` `"build"` script performs a type-check-only compilation, and tests are plain TypeScript files run via `tsx`.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 18 (ESM support required) | Runtime |
| npm | bundled with Node.js | Package management |
| TypeScript | `^5.6.3` (dev dependency) | Type checking |
| tsx | `^4.19.2` (dev dependency) | Running `.ts` files directly |

All dev dependencies are installed via `npm install`.

## Install Dependencies

```bash
npm install
```

This installs `typescript` and `tsx` into `node_modules`. No global installs are required.

## Type Checking

The `build` script runs `tsc --noEmit`, which type-checks all files matched by `tsconfig.json` (`src/**/*`) without writing any output to disk.

```bash
npm run build
```

A clean run produces no output and exits with code `0`. Any type errors are printed to stdout with file and line information.

**Compiler settings (from `tsconfig.json`):**

| Option | Value | Effect |
|--------|-------|--------|
| `target` | `ES2022` | Compile to ES2022 syntax |
| `module` | `ESNext` | Use ES module output |
| `moduleResolution` | `Bundler` | Resolve imports as a bundler would |
| `strict` | `true` | Enable all strict type checks |
| `noEmit` | `true` | Type-check only, no output files |
| `isolatedModules` | `true` | Each file must be independently compilable |
| `resolveJsonModule` | `true` | Allow importing `.json` files |

## Running Tests

Tests live in `src/__tests__/`. They are plain TypeScript files that use a minimal hand-rolled `assert` helper and `console.log` for output. There is no test runner binary — each test file is executed directly with `tsx`.

```bash
npx tsx src/__tests__/basic.test.ts
```

A passing run prints a confirmation message and exits with code `0`:

```
basic test passed
```

A failing assertion throws an `Error` and exits with a non-zero code, printing the assertion message to stderr.

### Running All Test Files

Because there is no test runner, all test files must be executed individually. A simple shell loop covers the `__tests__` directory:

```bash
for f in src/__tests__/*.test.ts; do npx tsx "$f"; done
```

## Full Local CI Sequence

The recommended sequence before committing mirrors what a CI pipeline would run:

```bash
npm install          # ensure dependencies are present
npm run build        # type-check all sources
npx tsx src/__tests__/basic.test.ts   # run tests
```

All three commands must exit with code `0` for the tree to be considered clean.

## Notes

- The project is declared as `"type": "module"` in `package.json`, so all `.ts` source files are treated as ES modules. Import paths inside the source use the `.js` extension (e.g., `import { getReelSymbols } from "../reels.js"`) as required by Node.js ESM resolution.
- `tsc --noEmit` does **not** produce JavaScript output. The compiled artifacts are never written to disk; `tsx` is used to run TypeScript sources directly in both development and test contexts.
- There is no linting tool (e.g., ESLint) configured in `package.json`. Only TypeScript strict-mode type checking is enforced.

## See Also

- [Source Tree](05-Development/01-Source-Tree.md)
- [Code Conventions](05-Development/03-Code-Conventions.md)
- [Release Process](05-Development/04-Release-Process.md)
- [Public API](04-API-Reference/01-Public-API.md)