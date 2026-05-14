# Types and Interfaces

> Complete reference for every public TypeScript type, interface, and type alias exported by slot-engine.

## Overview

All domain types are declared in `src/types.ts`. The `Bet` type alias and the re-export of `SpinResult` are also surfaced through `src/engine.ts` and re-exported from the package entry point `src/index.ts`. Types that are used internally but not re-exported from the package root are noted as such.

## Type: `Symbol`

**Source:** `src/types.ts`

A string literal union representing the eight reel symbols the engine can place in any grid cell.

```typescript
export type Symbol =
  | "CHERRY"
  | "LEMON"
  | "BELL"
  | "BAR"
  | "SEVEN"
  | "DIAMOND"
  | "WILD"
  | "SCATTER";
```

| Value       | Category             | Notes                                           |
|-------------|----------------------|-------------------------------------------------|
| `"CHERRY"`  | Low-value regular    | 25× weight on every reel                        |
| `"LEMON"`   | Low-value regular    | 25× weight on every reel                        |
| `"BELL"`    | Mid-value regular    | 15× weight                                      |
| `"BAR"`     | Mid-value regular    | 10× weight                                      |
| `"SEVEN"`   | High-value regular   | 5× weight                                       |
| `"DIAMOND"` | Premium / jackpot    | 30× weight; 4+ anywhere triggers jackpot        |
| `"WILD"`    | Special – substitute | Counts as any regular symbol; applies multiplier|
| `"SCATTER"` | Special – bonus      | 3+ anywhere awards free spins; not a line symbol|

`WILD` and `SCATTER` are excluded from the `LineWin.symbol` field — they never appear there as a matched symbol.

## Type Alias: `Bet`

**Source:** `src/engine.ts`, re-exported from `src/index.ts`

```typescript
export type Bet = number;
```

Represents the total coins wagered on a single spin. Valid values are **integers in the range 1–100 inclusive**. The `spin()` function throws the string `"invalid bet"` when the value is non-integer or less than 1, and logs a `console.warn` when the value exceeds 100.

## Interface: `LineWin`

**Source:** `src/types.ts`

Describes a single winning payline evaluation result. One `LineWin` is produced for each of the ten paylines where a qualifying match (3–5 consecutive symbols) is found.

```typescript
export interface LineWin {
  lineIndex: number;
  symbol: Symbol;
  count: number;
  payout: number;
}
```

| Field       | Type     | Description                                                                          |
|-------------|----------|--------------------------------------------------------------------------------------|
| `lineIndex` | `number` | Zero-based payline index (0–9) corresponding to the ten built-in payline patterns.   |
| `symbol`    | `Symbol` | The matched symbol. Never `"WILD"` or `"SCATTER"`.                                   |
| `count`     | `number` | Number of matching positions from the left: `3`, `4`, or `5`.                        |
| `payout`    | `number` | Coins awarded for this line, after the wild multiplier boost is applied if applicable.|

The `payout` formula when wilds are present in the run is:

```
payout = baseMultiplier × lineBet × (1 + wildCount) × 2^wildCount
```

## Interface: `SpinResult`

**Source:** `src/types.ts`, re-exported from `src/engine.ts` and `src/index.ts`

The complete outcome of a single call to `spin()`. All array fields are deeply read-only to prevent mutation after the fact.

```typescript
export interface SpinResult {
  reels: ReadonlyArray<ReadonlyArray<Symbol>>;
  lineWins: ReadonlyArray<LineWin>;
  wildMultiplier: number;
  scatterCount: number;
  freeSpinsAwarded: number;
  jackpotHit: boolean;
  totalPayout: number;
}
```

| Field              | Type                                      | Description                                                                                                     |
|--------------------|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `reels`            | `ReadonlyArray<ReadonlyArray<Symbol>>`    | 5 × 3 grid. Outer index = reel/column (0–4); inner index = row (0–2).                                          |
| `lineWins`         | `ReadonlyArray<LineWin>`                  | All qualifying line wins for this spin. Empty array when no paylines match.                                     |
| `wildMultiplier`   | `number`                                  | The highest wild multiplier factor applied across all winning lines. `1` when no wilds contributed to any win.  |
| `scatterCount`     | `number`                                  | Total `SCATTER` symbols visible anywhere in the 5 × 3 grid.                                                    |
| `freeSpinsAwarded` | `number`                                  | Free spins granted by this spin. `10` on a fresh trigger, `10` added on retrigger, `0` otherwise.              |
| `jackpotHit`       | `boolean`                                 | `true` when four or more `DIAMOND` symbols appear in the grid.                                                  |
| `totalPayout`      | `number`                                  | Final coin payout (ceiling-rounded) after house-edge adjustment. Always ≥ `Math.ceil(bet × 0.01)`.             |

## Interface: `FreeSpinState`

**Source:** `src/types.ts`

Internal mutable state record managed by `handleFreeSpins()` in `src/freespin.ts`. Not exported from the package entry point; consumed within `spin()`.

```typescript
export interface FreeSpinState {
  active: boolean;
  remaining: number;
  totalWon: number;
}
```

| Field       | Type      | Description                                                                |
|-------------|-----------|----------------------------------------------------------------------------|
| `active`    | `boolean` | `true` while a free-spin session is in progress.                           |
| `remaining` | `number`  | Spins left in the current session. Copied to `SpinResult.freeSpinsAwarded`.|
| `totalWon`  | `number`  | Cumulative coins won during the free-spin session (tracked internally).    |

## Type: `LegacySpinResult`

**Source:** `src/types.ts`

A simplified result shape used by the legacy payout path in `src/legacy.ts`. Not exported from the package entry point.

```typescript
export type LegacySpinResult = {
  reels: Symbol[][];
  payout: number;
  jackpot: boolean;
};
```

Unlike `SpinResult`, the `reels` field uses mutable `Symbol[][]`. This type exists for backward compatibility; new code should use `SpinResult`.

## Examples

### Typing a spin result

```typescript
import { spin, type SpinResult, type Bet } from "slot-engine";

const bet: Bet = 50;
const result: SpinResult = spin(bet);

// Access the 5×3 grid
const middleRowSymbols: string[] = result.reels.map(col => col[1]);
console.log("Middle row:", middleRowSymbols.join(" | "));
// e.g. "Middle row: CHERRY | WILD | BELL | BELL | CHERRY"
```

### Narrowing LineWin results

```typescript
import { spin, type LineWin } from "slot-engine";

const result = spin(10);

const bigWins: LineWin[] = result.lineWins.filter(w => w.payout >= 100);
for (const win of bigWins) {
  console.log(
    `Payline ${win.lineIndex}: ${win.count}× ${win.symbol} = ${win.payout} coins`
  );
}
// Example output:
// Payline 0: 5× SEVEN = 250 coins
```

### Checking all bonus conditions

```typescript
import { spin } from "slot-engine";

const result = spin(100);

if (result.jackpotHit) {
  console.log("Jackpot! 4+ DIAMONDs in grid.");
}

if (result.freeSpinsAwarded > 0) {
  console.log(`Free spins triggered: ${result.freeSpinsAwarded} spins awarded.`);
}

if (result.wildMultiplier > 1) {
  console.log(`Wild multiplier active: ${result.wildMultiplier}×`);
}

console.log(`Total payout: ${result.totalPayout} coins`);
// Total payout: 312 coins
```

### Working with FreeSpinState directly

```typescript
import { handleFreeSpins } from "./src/freespin.js";
import type { FreeSpinState } from "./src/types.js";

const state: FreeSpinState = { active: false, remaining: 0, totalWon: 0 };

// Simulate landing 3 scatter symbols
handleFreeSpins(state, 3);
console.log(state.active);    // true
console.log(state.remaining); // 10
```

## See Also

- [Public API](04-API-Reference/01-Public-API.md) — `spin()` function signature and usage
- [Core Concepts](02-Architecture/02-Core-Concepts.md) — domain glossary explaining symbols, paylines, wilds, scatters, and the jackpot
- [Data Flow](02-Architecture/03-Data-Flow.md) — how `SpinResult` is assembled step-by-step
- [Configuration Schema](04-API-Reference/02-Configuration-Schema.md) — configuration options that affect engine behaviour