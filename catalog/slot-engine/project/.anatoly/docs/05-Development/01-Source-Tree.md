# Source Tree

> Annotated map of every file in the `slot-engine` repository with module-level responsibilities.

## Overview

The project is a pure-TypeScript ESM package. All game logic lives under `src/`. There is no build output directory — TypeScript is consumed directly via `tsx` at runtime and validated with `tsc --noEmit`. The source is split into small single-responsibility modules that are composed by `engine.ts`.

## Repository Layout

```
slot-engine/
├── package.json          # Package metadata and scripts
├── tsconfig.json         # TypeScript compiler configuration
├── src/
│   ├── index.ts          # Public entry point — re-exports the public API
│   ├── engine.ts         # Spin orchestration and payout computation
│   ├── types.ts          # Shared TypeScript types and interfaces
│   ├── reels.ts          # Reel symbol definitions and weighted spin logic
│   ├── paytable.ts       # Pay table data and multiplier lookup
│   ├── wild.ts           # Wild-symbol bonus multiplier utility
│   ├── jackpot.ts        # Progressive jackpot detection
│   ├── freespin.ts       # Scatter detection and free-spin state machine
│   ├── rng.ts            # Weighted random-pick utility
│   ├── events.ts         # Lightweight in-process event emitter
│   ├── factories.ts      # Abstract factory for reel construction
│   ├── strategy.ts       # Strategy pattern for payout adjustment
│   ├── legacy.ts         # Backward-compatible payout helper
│   └── __tests__/
│       └── basic.test.ts # Unit tests
```

## Module Descriptions

### `src/index.ts` — Public Entry Point

Re-exports the three public symbols that form the package's external API:

```typescript
export { spin, type Bet, type SpinResult } from "./engine.js";
```

Nothing else is exported. All other modules are internal implementation details.

---

### `src/engine.ts` — Spin Orchestration

The central module. Exposes two functions:

| Function | Signature | Description |
|---|---|---|
| `spin` | `(bet: Bet) => SpinResult` | Runs one complete spin, evaluates paylines, applies bonuses, returns the result. |
| `computePayout` | `(lineWins: LineWin[], bet: any) => number` | Applies the house edge (`HOUSE_EDGE = 0.05`) and a minimum return to produce the final coin payout. |

`spin` wires together every other module via an `EngineContainer` (a lightweight service locator), builds five reels through `StandardReelBuilderFactory`, evaluates all ten `PAYLINES`, then aggregates scatter, free-spin, jackpot, and wild-multiplier results into a `SpinResult`.

Internal helpers `checkLine` and `evaluateLine` are not exported.

---

### `src/types.ts` — Shared Types

Defines all domain types consumed across modules. See [Types and Interfaces](../04-API-Reference/03-Types-and-Interfaces.md) for the complete reference.

Key types:

| Type | Kind | Purpose |
|---|---|---|
| `Symbol` | union type | Eight possible reel symbols |
| `LineWin` | interface | One resolved winning payline |
| `FreeSpinState` | interface | Mutable free-spin session state |
| `SpinResult` | interface | Complete outcome of a single spin |
| `LegacySpinResult` | type alias | Deprecated result shape used by `legacy.ts` |

---

### `src/reels.ts` — Reel Definitions

Owns symbol enumeration and per-reel weighted sampling.

| Export | Description |
|---|---|
| `spinReel(reelIndex)` | Returns a 3-symbol column for reel `reelIndex` using `DEFAULT_WEIGHTS`. |
| `getReelSymbols()` | Returns the ordered array of all eight `Symbol` values. |
| `getReelWeights(reelIndex)` | Returns the weight array for the given reel (all five reels share `DEFAULT_WEIGHTS`). |

All five reels use identical weights: CHERRY 25, LEMON 25, DIAMOND 30, BELL 15, BAR 10, SEVEN 5, WILD 5, SCATTER 5.

---

### `src/paytable.ts` — Pay Table

Maps symbols and match counts to payout multipliers.

| Export | Description |
|---|---|
| `getPayMultiplier(symbol, count)` | Returns the multiplier for `count` ∈ {3, 4, 5}; returns `0` for WILD/SCATTER or unknown symbols. |
| `lineWins(symbols)` | Evaluates a 5-symbol array and returns the leading run (≥ 3) or `null`. |
| `ANCIENT_RTP` | Constant `0.95` — the engine's target RTP. |

Pay table summary:

| Symbol | ×3 | ×4 | ×5 |
|---|---|---|---|
| CHERRY / LEMON | 2 | 5 | 25 |
| BELL | 5 | 20 | 100 |
| BAR | 10 | 40 | 200 |
| SEVEN | 25 | 100 | 500 |
| DIAMOND | 50 | 250 | 1000 |

---

### `src/wild.ts` — Wild Bonus

Single exported utility:

```typescript
applyWildBonus(basePayout: number, wildCount: number): number
```

Returns `basePayout * (1 + wildCount) * 2 ** wildCount`. Returns `basePayout` unchanged when `wildCount ≤ 0`. This formula is also applied inline inside `engine.ts`'s `evaluateLine`.

---

### `src/jackpot.ts` — Jackpot Detection

```typescript
isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean
```

Scans all 15 cells (5 reels × 3 rows) and returns `true` when four or more DIAMOND symbols appear in a single spin.

---

### `src/freespin.ts` — Free-Spin State Machine

| Export | Description |
|---|---|
| `detectScatters(reels)` | Counts all SCATTER symbols across the full 5×3 grid. |
| `handleFreeSpins(state, scatters)` | Mutates a `FreeSpinState` object: awards 10 free spins when ≥ 3 scatters appear; adds 10 more if already active; decrements `remaining` otherwise. |

`handleFreeSpins` mutates its `state` argument in place. The caller in `engine.ts` reads `state.remaining` after the call to populate `SpinResult.freeSpinsAwarded`.

---

### `src/rng.ts` — Random Number Generator

```typescript
weightedPick<T>(items: T[], weights: number[]): T
```

Generic cumulative-weight sampler backed by `Math.random()`. Used by `reels.ts` internally and registered in `EngineContainer` under the key `"rng"`.

---

### `src/events.ts` — Event Emitter

A minimal in-process pub/sub implementation with three methods (`on`, `off`, `emit`) and the exported constant `SPIN_DONE = "spin:done"`.

`engine.ts` instantiates a `SpinEventEmitter` per spin and emits `SPIN_DONE` with the final `SpinResult` after the spin completes. No handlers are registered in the default path — the emitter is available for extension by downstream code.

---

### `src/factories.ts` — Reel Builder Factory

Implements the Abstract Factory pattern for reel construction.

| Class | Description |
|---|---|
| `AbstractReelBuilderFactory` | Abstract base declaring `buildReels(reelCount, rowCount): Symbol[][]`. |
| `StandardReelBuilderFactory` | Concrete implementation; calls `spinReel(i)` for each reel index. |

`engine.ts` always uses `StandardReelBuilderFactory`. The abstract base exists to allow alternative implementations (e.g., seeded or mock reels in tests).

---

### `src/strategy.ts` — Payout Strategy

Implements the Strategy pattern for final payout adjustment.

| Class | Description |
|---|---|
| `SpinStrategy` | Abstract base declaring `adjustPayout(result: SpinResult): SpinResult`. |
| `DefaultStrategy` | Returns the result unchanged (identity). |
| `ConservativeStrategy` | Reduces `totalPayout` to 80% (`Math.floor(result.totalPayout * 0.8)`). |

`engine.ts` instantiates `DefaultStrategy`. `ConservativeStrategy` is available for custom configurations.

---

### `src/legacy.ts` — Legacy Payout Helper

```typescript
computeLegacyPayout(lineSymbols: Symbol[], bet: number): number
```

Evaluates a single 5-symbol line without house-edge adjustments. Delegates to `getPayMultiplier` from `paytable.ts`. Intended for backward compatibility with callers that supply a pre-sliced symbol array rather than a full `SpinResult`.

---

### `src/__tests__/basic.test.ts` — Unit Tests

Integration and unit tests for the engine. Run via the `tsx` dev dependency. See [Build and Test](./02-Build-and-Test.md) for commands.

## Configuration Files

### `tsconfig.json`

| Option | Value | Effect |
|---|---|---|
| `target` | `ES2022` | Emit modern JS (unused — `noEmit: true`). |
| `module` | `ESNext` | Native ESM imports. |
| `moduleResolution` | `Bundler` | Allows `.js` extensions on `.ts` source imports. |
| `strict` | `true` | Full strict-mode type checking. |
| `noEmit` | `true` | Type-check only; no output files are written. |
| `include` | `src/**/*` | Scopes compilation to the `src/` directory. |

### `package.json`

| Field | Value |
|---|---|
| `type` | `"module"` — all `.js` files are treated as ESM. |
| `main` | `src/index.ts` — entry point before bundling. |
| `scripts.build` | `tsc --noEmit` — type-check only. |
| `devDependencies` | `typescript ^5.6.3`, `tsx ^4.19.2` |

## Examples

Importing a single internal module to call `getPayMultiplier` directly (useful in tests or custom tooling):

```typescript
import { getPayMultiplier } from "./src/paytable.js";

// DIAMOND matching 5 in a row → multiplier 1000
const multiplier = getPayMultiplier("DIAMOND", 5);
console.log(multiplier); // 1000
```

Verifying jackpot detection with a crafted reel grid:

```typescript
import { isJackpotHit } from "./src/jackpot.js";

const reels = [
  ["DIAMOND", "DIAMOND", "DIAMOND"],
  ["DIAMOND", "CHERRY", "LEMON"],
  ["BELL",    "BAR",    "SEVEN"],
  ["LEMON",   "CHERRY", "BELL"],
  ["BAR",     "SEVEN",  "CHERRY"],
];

console.log(isJackpotHit(reels)); // true  (4 × DIAMOND found)
```

## See Also

- [Public API](../04-API-Reference/01-Public-API.md) — `spin` function signature and return type
- [Types and Interfaces](../04-API-Reference/03-Types-and-Interfaces.md) — All exported TypeScript types
- [Build and Test](./02-Build-and-Test.md) — How to type-check and run tests
- [Code Conventions](./03-Code-Conventions.md) — Naming and structural conventions used across these modules
- [System Overview](../02-Architecture/01-System-Overview.md) — High-level component diagram