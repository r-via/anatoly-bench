# Core Concepts

> Glossary and key domain concepts for the slot-engine library.

## Overview

slot-engine models a classic 5-reel, 3-row video slot machine. Understanding the domain vocabulary is essential before reading the architecture, data-flow, or API reference pages. Every term defined here maps directly to a type, constant, or function in the source code.

## Symbol

A `Symbol` is the atomic unit displayed in each cell of the grid. The engine defines exactly eight symbols:

| Symbol    | Role                  | Relative Weight |
|-----------|-----------------------|-----------------|
| `CHERRY`  | Low-value regular     | 25              |
| `LEMON`   | Low-value regular     | 25              |
| `BELL`    | Mid-value regular     | 15              |
| `BAR`     | Mid-value regular     | 10              |
| `SEVEN`   | High-value regular    | 5               |
| `DIAMOND` | Premium / jackpot key | 30              |
| `WILD`    | Substitutes + boosts  | 5               |
| `SCATTER` | Triggers free spins   | 5               |

Weights control how often each symbol appears on a reel stop. All five reels share the same default weight profile (`DEFAULT_WEIGHTS` in `src/reels.ts`).

```typescript
// src/types.ts
export type Symbol =
  | "CHERRY" | "LEMON" | "BELL" | "BAR"
  | "SEVEN"  | "DIAMOND" | "WILD" | "SCATTER";
```

## Reel and Grid

The engine spins **five vertical reels** (columns), each exposing **three rows**. The visible grid is therefore 5 × 3 = 15 cells. In the `SpinResult`, the grid is represented as a `ReadonlyArray<ReadonlyArray<Symbol>>` where the outer index is the column (reel) and the inner index is the row.

Each reel column is produced independently by `spinReel(reelIndex)` in `src/reels.ts`, using weighted random selection via `weightedPick` from `src/rng.ts`.

## Payline

A **payline** is a fixed path through the grid, one cell per reel, evaluated left-to-right for matching symbols. The engine defines **ten paylines**, stored as `number[][]` in `src/engine.ts`:

| Index | Row per reel          | Pattern description |
|-------|-----------------------|---------------------|
| 0     | `[1,1,1,1,1]`         | Middle horizontal   |
| 1     | `[0,0,0,0,0]`         | Top horizontal      |
| 2     | `[2,2,2,2,2]`         | Bottom horizontal   |
| 3     | `[0,1,2,1,0]`         | V-shape             |
| 4     | `[2,1,0,1,2]`         | Inverted V          |
| 5     | `[0,0,1,2,2]`         | Diagonal down       |
| 6     | `[2,2,1,0,0]`         | Diagonal up         |
| 7     | `[1,0,1,2,1]`         | Zigzag              |
| 8     | `[1,2,1,0,1]`         | Inverse zigzag      |
| 9     | `[0,1,0,1,0]`         | Step                |

The **line bet** for each payline equals `bet / 10` (one tenth of the total bet per line).

## Line Win

A `LineWin` is produced when a payline contains three or more consecutive matching symbols from reel 1 onward. `WILD` substitutes for any regular symbol. `SCATTER` does not participate in line wins.

```typescript
// src/types.ts
export interface LineWin {
  lineIndex: number; // 0–9
  symbol: Symbol;    // matched symbol (never WILD or SCATTER)
  count: number;     // 3, 4, or 5
  payout: number;    // coins awarded for this line
}
```

Line detection is implemented in `checkLine()` and `evaluateLine()` inside `src/engine.ts`.

## Paytable

The **paytable** maps `(symbol, matchCount)` pairs to a base multiplier. The multiplier is applied to the line bet to compute the raw line payout before wild bonuses.

| Symbol  | 3-of-a-kind | 4-of-a-kind | 5-of-a-kind |
|---------|-------------|-------------|-------------|
| CHERRY  | 2×          | 5×          | 25×         |
| LEMON   | 2×          | 5×          | 25×         |
| BELL    | 5×          | 20×         | 100×        |
| BAR     | 10×         | 40×         | 200×        |
| SEVEN   | 25×         | 100×        | 500×        |
| DIAMOND | 50×         | 250×        | 1000×       |

`getPayMultiplier(symbol, count)` in `src/paytable.ts` performs the lookup.

## Wild and Wild Multiplier

`WILD` behaves as a universal substitute. When one or more `WILD` symbols appear within a winning run, the payout is boosted by the **wild multiplier formula**:

```
boostedPayout = basePayout × (1 + wildCount) × 2^wildCount
```

| WILDs in run | Multiplier factor |
|--------------|-------------------|
| 1            | 2 × 2 = 4×        |
| 2            | 3 × 4 = 12×       |
| 3            | 4 × 8 = 32×       |

The `wildMultiplier` field in `SpinResult` reports the highest multiplier factor applied across all winning lines in the spin. The standalone `applyWildBonus(basePayout, wildCount)` utility in `src/wild.ts` encapsulates the formula.

## Scatter and Free Spins

`SCATTER` symbols are counted across the entire 5 × 3 grid, regardless of payline position. When **three or more** scatters appear, the engine awards **10 free spins**:

- **Retrigger**: if 3+ scatters appear while a free-spin session is already active, another 10 spins are added.
- The `freeSpinsAwarded` field in `SpinResult` carries the number of spins awarded in the current spin.

Logic lives in `detectScatters()` and `handleFreeSpins()` in `src/freespin.ts`, operating on a `FreeSpinState` record:

```typescript
// src/types.ts
export interface FreeSpinState {
  active: boolean;
  remaining: number;
  totalWon: number;
}
```

## Progressive Jackpot

The jackpot is triggered when **four or more `DIAMOND` symbols** appear anywhere in the 5 × 3 grid in a single spin. The `jackpotHit` boolean in `SpinResult` signals this condition. Detection is performed by `isJackpotHit(reels)` in `src/jackpot.ts`.

## House Edge and RTP

The engine targets a theoretical **Return-to-Player (RTP) of 95%**, corresponding to a house edge of **5%** (`HOUSE_EDGE = 0.05`). `computePayout()` in `src/engine.ts` applies this edge to the raw line-win total before returning the final coin amount:

```
adjustedTotal = rawTotal × (1 + HOUSE_EDGE)   // when rawTotal > 0
finalPayout   = ceil(adjustedTotal) + bet × 0.01
```

The small `bet × 0.01` term ensures a non-zero floor return on every spin.

## Bet

`Bet` is a plain `number` type alias representing the total coins wagered per spin. Valid values are **integers in the range 1–100** inclusive. The `spin()` function throws when the value is non-integer or less than 1, and logs a warning when it exceeds 100.

## Examples

### Inspecting a full spin outcome

```typescript
import { spin } from "slot-engine";

const result = spin(20); // 20-coin bet, 10 paylines × 2-coin line bet

// Grid: 5 reels × 3 rows
result.reels.forEach((col, reelIdx) => {
  console.log(`Reel ${reelIdx + 1}:`, col.join(" | "));
});

// Line wins
for (const win of result.lineWins) {
  console.log(
    `Line ${win.lineIndex}: ${win.count}× ${win.symbol} → ${win.payout} coins`
  );
}

// Bonus features
if (result.wildMultiplier > 1) {
  console.log("Wild multiplier applied:", result.wildMultiplier);
}
if (result.freeSpinsAwarded > 0) {
  console.log("Free spins awarded:", result.freeSpinsAwarded);
}
if (result.jackpotHit) {
  console.log("JACKPOT!");
}

console.log("Total payout:", result.totalPayout, "coins");
```

### Using the paytable directly

```typescript
import { getPayMultiplier } from "./src/paytable.js";

// 5-of-a-kind SEVEN pays 500× the line bet
const multiplier = getPayMultiplier("SEVEN", 5); // → 500
const lineBet = 10 / 10;                          // bet=10, 10 lines
console.log("Raw payout:", multiplier * lineBet); // → 50 coins (before wild boost)
```

### Wild multiplier calculation

```typescript
import { applyWildBonus } from "./src/wild.js";

const base = 50;           // base payout for the line
const withOneWild  = applyWildBonus(base, 1); // 50 × 2 × 2^1 = 200
const withTwoWilds = applyWildBonus(base, 2); // 50 × 3 × 2^2 = 600
console.log(withOneWild, withTwoWilds);
```

## See Also

- [System Overview](02-Architecture/01-System-Overview.md) — component diagram showing how these concepts map to source modules
- [Data Flow](02-Architecture/03-Data-Flow.md) — step-by-step trace of a spin from `bet` to `SpinResult`
- [Types and Interfaces](04-API-Reference/03-Types-and-Interfaces.md) — full TypeScript definitions for `Symbol`, `LineWin`, `FreeSpinState`, and `SpinResult`
- [Public API](04-API-Reference/01-Public-API.md) — `spin()` function signature and usage