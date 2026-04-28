# Code Conventions

> Naming rules, module structure, TypeScript patterns, and testing practices used throughout the slot-engine codebase.

## Overview

slot-engine is a pure TypeScript library with no runtime dependencies. All conventions prioritise type safety, single-responsibility modules, and self-documenting code. There is no external linter or formatter configured; conformance relies on TypeScript strict mode and the patterns described below.

## TypeScript Configuration

The project targets **ES2022** with `"module": "ESNext"` and `"moduleResolution": "Bundler"`. Key compiler flags:

| Flag | Value | Effect |
|---|---|---|
| `strict` | `true` | Enables all strict checks |
| `noEmit` | `true` | Type-checking only; no JS output |
| `isolatedModules` | `true` | Every file must be an independent module |
| `forceConsistentCasingInFileNames` | `true` | Prevents case-insensitive import bugs |
| `esModuleInterop` | `true` | Allows default imports from CJS packages |

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src/**/*"]
}
```

## Naming Conventions

### Types and Interfaces

PascalCase for all type-level declarations.

```typescript
// Type alias
type Bet = number;

// String-literal union
type Symbol = "CHERRY" | "LEMON" | "BELL" | "BAR" | "SEVEN" | "DIAMOND" | "WILD" | "SCATTER";

// Interface
interface LineWin {
  payline: number;
  symbol: Symbol;
  count: number;
  payout: number;
}

// Configuration interface
interface ReelWeightConfig {
  [symbol: string]: number;
}
```

### Functions

camelCase for all function and method names.

```typescript
function weightedPick<T>(items: T[], weights: number[]): T { /* … */ }
function spinReel(weights: ReelWeightConfig): Symbol[] { /* … */ }
function getPayMultiplier(symbol: Symbol, count: number): number { /* … */ }
function detectScatters(grid: Symbol[][]): number { /* … */ }
function isJackpotHit(grid: Symbol[][]): boolean { /* … */ }
```

### Constants

UPPER_SNAKE_CASE for module-level constants.

```typescript
const HOUSE_EDGE = 0.05;
const DEBUG_MODE = false;
const SYMBOLS: Symbol[] = ["CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER"];
const PAYLINES: number[][] = [ /* … */ ];
const SPIN_DONE = "spin:done";
```

### Event Names

Event name strings use `namespace:event` kebab-case format.

```typescript
emitter.emit("spin:done", result);
emitter.on("spin:done", (result) => { /* … */ });
```

## Module Organisation

Each file in `src/` owns a single responsibility. No module imports from more than the modules it directly depends on.

| Module | Responsibility |
|---|---|
| `types.ts` | All exported type definitions and interfaces |
| `engine.ts` | Core `spin()` orchestration and `EngineContainer` |
| `rng.ts` | Weighted random selection (`weightedPick`) |
| `reels.ts` | Reel spinning and symbol weight configuration |
| `paytable.ts` | Pay table data and multiplier lookup (`getPayMultiplier`) |
| `freespin.ts` | Free-spin detection and `FreeSpinState` management |
| `jackpot.ts` | Jackpot hit detection |
| `wild.ts` | Wild-symbol bonus calculation |
| `strategy.ts` | `SpinStrategy` base class and concrete strategy implementations |
| `factories.ts` | `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` |
| `events.ts` | `SpinEventEmitter` |
| `legacy.ts` | Legacy payout computation path |
| `index.ts` | Public re-exports only |

## Import Style

### ESM `.js` Extensions

Import paths always use the `.js` extension, even though source files are `.ts`. This satisfies the Node.js ESM resolver used at runtime.

```typescript
import type { Symbol, LineWin, SpinResult } from "./types.js";
import { weightedPick } from "./rng.js";
import { spinReel } from "./reels.js";
```

### `import type` for Type-Only Imports

Type-only imports use `import type` to enable tree-shaking and to avoid circular-module issues at runtime.

```typescript
// Correct — does not generate a runtime import statement
import type { FreeSpinState } from "./types.js";

// Avoid for pure types
import { FreeSpinState } from "./types.js"; // unnecessary runtime reference
```

### No Default Exports

All exports are named. Default exports are not used anywhere in the codebase.

```typescript
// Correct
export function spin(bet: Bet): SpinResult { /* … */ }
export type { Symbol, SpinResult };

// Not used
export default spin;
```

## Type Patterns

### Prefer `ReadonlyArray` in Public API

All arrays exposed through `SpinResult` use `ReadonlyArray` to prevent callers from mutating engine output.

```typescript
interface SpinResult {
  reels: ReadonlyArray<ReadonlyArray<Symbol>>;
  lineWins: ReadonlyArray<LineWin>;
  // …
}
```

### String-Literal Unions over Enums

`Symbol` is a string-literal union rather than a TypeScript `enum`. This produces smaller output, integrates naturally with JSON, and enables exhaustive checks without an enum import.

```typescript
type Symbol = "CHERRY" | "LEMON" | "BELL" | "BAR" | "SEVEN" | "DIAMOND" | "WILD" | "SCATTER";
```

### `Record` for Lookup Tables

Paytable and weight maps use `Record<string, …>` or indexed interfaces.

```typescript
const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2, 5, 10],
  SEVEN:   [10, 25, 100],
  DIAMOND: [15, 50, 200],
  // …
};
```

### Generics Only Where Necessary

Generic types appear only in infrastructure code (`weightedPick<T>`, `resolve<T>`) where the type parameter meaningfully constrains behaviour. Domain functions use concrete types.

## Design Patterns

### Strategy

`SpinStrategy` is an abstract base class. Concrete implementations override the payout adjustment hook:

- `DefaultStrategy` — returns the payout unchanged.
- `ConservativeStrategy` — applies a 20% reduction.

New strategies extend `SpinStrategy` without modifying `engine.ts`.

### Service Container

`EngineContainer` provides a minimal dependency-injection registry. Services are registered with a string key and retrieved with a typed `resolve<T>()` call.

```typescript
const container = new EngineContainer();
container.register("rng", weightedPick);
container.register("reels", spinReel);
const rng = container.resolve<typeof weightedPick>("rng");
```

### Abstract Factory

`AbstractReelBuilderFactory` declares the factory contract. `StandardReelBuilderFactory` is the production implementation. Separating construction from orchestration allows alternative reel configurations to be substituted without touching `engine.ts`.

## Error Handling

Input validation in the public `spin()` entry point throws early with a plain string message. Internal functions assume validated input.

```typescript
if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
  throw "invalid bet";
}
if (bet > 100) {
  console.warn("bet exceeds maximum; clamping to 100");
}
```

Avoid try/catch inside engine internals. Surface errors to the caller rather than silently swallowing them.

## JSDoc Comments

Public functions and non-obvious algorithms carry a JSDoc block. Inline comments are used sparingly; prefer self-documenting names.

```typescript
/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */
function weightedPick<T>(items: T[], weights: number[]): T {
  // …
}
```

Private helpers and one-liners do not require JSDoc.

## Testing

Tests live in `src/__tests__/`. The project uses no test framework — assertions are raw `assert()` calls imported from Node's built-in `assert` module.

```typescript
import assert from "node:assert/strict";
import { spin } from "../index.js";

const result = spin(10);
assert.ok(result.totalPayout >= 0, "payout must be non-negative");
assert.strictEqual(result.reels.length, 5, "must have 5 reels");
```

Tests are run directly with `tsx`:

```bash
npx tsx src/__tests__/basic.test.ts
```

There is no test runner, no coverage tool, and no watch mode configured.

## Anti-Patterns to Avoid

- **`any` types** — use generics or unknown with a type guard instead.
- **Mutable exported arrays** — wrap in `ReadonlyArray` before returning from public functions.
- **Default exports** — use named exports throughout.
- **Relative imports without `.js` extension** — the ESM resolver requires explicit extensions.
- **Side effects at module load time** — modules should export pure functions and constants; no I/O on import.
- **Cross-responsibility imports** — e.g., `paytable.ts` must not import from `engine.ts`.

## Examples

### Extending with a Custom Strategy

```typescript
import { SpinStrategy } from "./strategy.js";
import type { SpinResult } from "./types.js";

// Double-payout strategy for promotional events
class PromoStrategy extends SpinStrategy {
  adjust(result: SpinResult): SpinResult {
    return { ...result, totalPayout: result.totalPayout * 2 };
  }
}
```

### Registering a Custom RNG via the Service Container

```typescript
import { EngineContainer } from "./engine.js";

function seededPick<T>(items: T[], weights: number[]): T {
  // deterministic pick using a seeded PRNG
  const index = 0; // simplified
  return items[index];
}

const container = new EngineContainer();
container.register("rng", seededPick);
```

### Type-Safe Symbol Comparison

```typescript
import type { Symbol } from "./types.js";

function isWild(s: Symbol): boolean {
  return s === "WILD";
}

function isScatter(s: Symbol): boolean {
  return s === "SCATTER";
}
```

## See Also

- [Source Tree](05-Development/01-Source-Tree.md) — annotated directory listing with per-module descriptions.
- [Build and Test](05-Development/02-Build-and-Test.md) — how to run the type-checker and tests.
- [Types and Interfaces](04-API-Reference/03-Types-and-Interfaces.md) — complete reference for all exported TypeScript types.
- [Public API](04-API-Reference/01-Public-API.md) — `spin()` signature and `SpinResult` structure.
- [Core Concepts](02-Architecture/02-Core-Concepts.md) — domain vocabulary (Symbol, Payline, Wild multiplier, etc.).