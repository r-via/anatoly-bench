# Installation

> Step-by-step instructions for installing slot-engine and verifying the setup.

## Overview

slot-engine is distributed as a TypeScript-native package with no runtime dependencies. Installation requires only Node.js and npm. The package exposes its entry point directly as a TypeScript source file (`src/index.ts`), so a TypeScript-aware runtime or build pipeline is needed to consume it.

## Prerequisites

| Requirement | Minimum version | Notes |
|-------------|-----------------|-------|
| Node.js | 18.x or later | ESM support required (`"type": "module"`) |
| npm | 8.x or later | Bundled with Node.js 18+ |
| TypeScript | 5.6.x | Listed as a `devDependency` |

No external services, databases, or environment variables are required.

## Install

Run the following command in your project directory:

```bash
npm install slot-engine
```

To install within the repository itself (for local development or to run examples directly):

```bash
npm install
```

This installs the two declared development dependencies:

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | `^5.6.3` | Type checking and compilation |
| `tsx` | `^4.19.2` | Execute TypeScript files directly via Node.js |

## Verify the Installation

After installing, confirm that the TypeScript compiler resolves the package without errors:

```bash
npx tsc --noEmit
```

A successful run produces no output and exits with code `0`.

To run a TypeScript file that imports slot-engine directly (without a separate compile step), use `tsx`:

```bash
npx tsx my-script.ts
```

## First Import

Once installed, import the `spin` function from the package entry point:

```typescript
import { spin } from "slot-engine";

const result = spin(10);
console.log(result.totalPayout);
```

The `main` field in `package.json` points to `src/index.ts`. Consumers using a bundler with TypeScript support (e.g., `tsx`, `ts-node`, `esbuild`) can import the package directly without a separate compilation step.

## TypeScript Configuration

The repository ships a `tsconfig.json` with the following key settings relevant to consumers:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

`moduleResolution: "Bundler"` is required to resolve the `src/index.ts` entry point. Consumers using `"moduleResolution": "Node"` or `"Node16"` may need to adjust their own `tsconfig.json` accordingly.

## See Also

- [Overview](01-Getting-Started/01-Overview.md) — What slot-engine does and why it exists
- [Quick Start](01-Getting-Started/04-Quick-Start.md) — End-to-end tutorial from install to first spin result
- [Build and Test](05-Development/02-Build-and-Test.md) — Running the build, type-checker, and tests locally
- [Public API](04-API-Reference/01-Public-API.md) — Full reference for `spin` and the `SpinResult` type