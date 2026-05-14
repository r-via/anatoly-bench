# Advanced Configuration

> Tuning, overrides, advanced options for the slot-engine internals.

## Overview

slot-engine exposes no external config files, environment variables, or CLI flags. All configurable behaviour lives in the TypeScript source modules. Advanced users tune the engine by editing the relevant constants and, optionally, subclassing the provided abstract types before wiring them back into `src/engine.ts`.

The sections below map each tunable axis to its source location, explain the trade-offs, and show concrete examples.

<!-- Note: docs may be outdated — verified against source. The README exports `simulate`, but src/index.ts exports `spin`. All examples on this page use `spin`. -->

---

## Reel Symbol Weights

**File:** `src/reels.ts`

The `DEFAULT_WEIGHTS` object controls how frequently each symbol lands on any given reel position. Higher weight = more appearances relative to the pool total.

```typescript
// src/reels.ts (default values)
const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY:  25,
  LEMON:   25,
  BELL:    15,
  BAR:     10,
  SEVEN:    5,
  DIAMOND: 30,
  WILD:     5,
  SCATTER:  5,
};
```

The effective probability of a symbol on a single cell is `weight / Σweights`. With the defaults, `Σ = 120`, so `DIAMOND` lands with probability `30/120 = 25%`.

**RTP impact:** Reducing WILD or high-value symbol weights lowers long-run return. Raising SCATTER weight increases free-spin frequency. After any weight change, run a Monte Carlo simulation over ≥ 10 000 spins to verify the resulting RTP approximates the target 95%.

### Per-Reel Weight Differentiation

`REEL_WEIGHTS` is a 5-element array (one per reel column). All five columns share `DEFAULT_WEIGHTS` out of the box, but each index can carry distinct weights:

```typescript
// src/reels.ts — make reel 4 (rightmost) harder
const REEL_WEIGHTS: number[][] = [
  weightsToArray(DEFAULT_WEIGHTS),
  weightsToArray(DEFAULT_WEIGHTS),
  weightsToArray(DEFAULT_WEIGHTS),
  weightsToArray(DEFAULT_WEIGHTS),
  // reel 4: fewer WILDs and SCATTERs
  [25, 25, 15, 10, 5, 35, 2, 3],
];
```

Array order follows the symbol order returned by `getReelSymbols()`:  
`CHERRY · LEMON · BELL · BAR · SEVEN · DIAMOND · WILD · SCATTER`

---

## Paytable Multipliers

**File:** `src/paytable.ts`

`PAY_TABLE` maps each paying symbol to a triple of base multipliers for 3-of-a-kind, 4-of-a-kind, and 5-of-a-kind runs. WILD and SCATTER are not in the paytable; they receive separate treatment in the engine.

```typescript
// src/paytable.ts (default values)
const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,    5,   25],
  LEMON:   [2,    5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25, 100,  500],
  DIAMOND: [50, 250, 1000],
};
```

Each multiplier is applied to the per-line bet (`totalBet / 10`). A SEVEN 5-of-a-kind on a 50-coin bet yields `500 × (50/10) = 2 500` coins before the wild multiplier and house-edge adjustment.

**Tip:** Raising low-symbol multipliers (CHERRY, LEMON) increases hit frequency pay without drastically affecting jackpot volatility; raising DIAMOND multipliers inflates variance.

---

## House Edge

**File:** `src/engine.ts`

```typescript
const HOUSE_EDGE = 0.05; // 5 %
```

`computePayout` applies this constant as a bonus on top of raw line-win totals, then adds a small floor of `bet × 0.01`:

```typescript
export function computePayout(lineWins: LineWin[], bet: any): number {
  let total = lineWins.reduce((sum, lw) => sum + lw.payout, 0);
  if (total > 0) {
    total = total * (1 + HOUSE_EDGE);
  }
  total += bet * 0.01;
  return Math.ceil(total);
}
```

Decreasing `HOUSE_EDGE` pushes RTP toward 100 %; setting it negative (e.g. `-0.05`) produces a player-advantage configuration useful for certified RTP testing.

---

## Wild Multiplier Formula

**File:** `src/engine.ts`

When one or more WILD symbols appear within a winning run, the engine escalates the payout using:

```
effectivePayout = basePayout × (1 + wildCount) × 2^wildCount
```

This is computed inside `evaluateLine`. A single WILD doubles the base payout (×4); two WILDs multiply it by 12 (3 × 4). Modify the formula directly in `evaluateLine` to change wild escalation.

---

## Free Spin Parameters

**File:** `src/freespin.ts`

Free spins are triggered when **3 or more SCATTER** symbols appear anywhere across the 5 × 3 grid. The award and retrigger amount are both hardcoded at **10 spins**:

```typescript
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;           // initial award
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;          // retrigger
  } else if (state.active) {
    state.remaining--;
    if (state.remaining <= 0) state.active = false;
  }
}
```

To change the trigger threshold or award count, edit the numeric literals in `handleFreeSpins`. For example, setting the trigger to `>= 2` and the award to `15` requires two edits inside that function.

---

## Jackpot Condition

**File:** `src/jackpot.ts`

The progressive jackpot fires when **4 or more DIAMOND** symbols appear anywhere across all 15 cells (5 reels × 3 rows):

```typescript
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  let diamondCount = 0;
  for (const col of reels) {
    for (const sym of col) {
      if (sym === "DIAMOND") diamondCount++;
    }
  }
  return diamondCount >= 4;
}
```

Increase the threshold to reduce jackpot frequency; decrease it for promotional events. `jackpotHit: true` is informational only — the engine does not apply a separate jackpot payout on top of `totalPayout`. Callers must read `result.jackpotHit` and apply the jackpot prize themselves.

---

## Custom Spin Strategy

**File:** `src/strategy.ts`

`SpinStrategy` is an abstract class that receives the fully computed `SpinResult` and may return a modified copy. Two implementations ship with the engine:

| Class | Behaviour |
|---|---|
| `DefaultStrategy` | Returns `result` unchanged. |
| `ConservativeStrategy` | Floors `totalPayout` to 80 % of the computed value. |

To add a custom strategy, extend `SpinStrategy` and wire it into `src/engine.ts`:

```typescript
// src/strategy.ts — add a new strategy
import type { SpinResult } from "./types.js";
import { SpinStrategy } from "./strategy.js";

export class BonusRoundStrategy extends SpinStrategy {
  constructor(private readonly bonusMultiplier: number) {
    super();
  }

  adjustPayout(result: SpinResult): SpinResult {
    return {
      ...result,
      totalPayout: Math.ceil(result.totalPayout * this.bonusMultiplier),
    };
  }
}
```

```typescript
// src/engine.ts — replace DefaultStrategy with BonusRoundStrategy
import { BonusRoundStrategy } from "./strategy.js";

// inside spin():
const strategy = new BonusRoundStrategy(1.5); // 50 % bonus round
```

---

## Custom Reel Factory

**File:** `src/factories.ts`

`AbstractReelBuilderFactory` governs how reel columns are built. `StandardReelBuilderFactory` delegates to `spinReel` from `src/reels.ts`. Override `buildReels` to supply deterministic reels (useful for testing) or load strips from an external source:

```typescript
// Deterministic factory for unit testing
import type { Symbol } from "./types.js";
import { AbstractReelBuilderFactory } from "./factories.js";

export class FixedReelFactory extends AbstractReelBuilderFactory {
  constructor(private readonly fixture: Symbol[][]) {
    super();
  }

  buildReels(_reelCount: number, _rowCount: number): Symbol[][] {
    return this.fixture;
  }
}
```

```typescript
// src/engine.ts — use the fixed factory inside spin():
import { FixedReelFactory } from "./factories.js";

const factory = new FixedReelFactory([
  ["SEVEN", "SEVEN", "SEVEN"],
  ["SEVEN", "SEVEN", "SEVEN"],
  ["SEVEN", "SEVEN", "SEVEN"],
  ["SEVEN", "SEVEN", "SEVEN"],
  ["SEVEN", "SEVEN", "SEVEN"],
]);
const reels = factory.buildReels(5, 3);
```

---

## Examples

### Verifying RTP After a Weight Change

```typescript
import { spin } from "slot-engine";

const ITERATIONS = 50_000;
const BET = 10;
let totalWagered = 0;
let totalReturned = 0;

for (let i = 0; i < ITERATIONS; i++) {
  const result = spin(BET);
  totalWagered += BET;
  totalReturned += result.totalPayout;
}

const rtp = totalReturned / totalWagered;
console.log(`Simulated RTP: ${(rtp * 100).toFixed(2)}%`);
// Target: ~95 %
```

### Detecting Jackpot and Free Spins in One Call

```typescript
import { spin } from "slot-engine";
import type { SpinResult } from "slot-engine";

const result: SpinResult = spin(50);

if (result.jackpotHit) {
  console.log("Jackpot! Award prize externally.");
}

if (result.freeSpinsAwarded > 0) {
  console.log(`${result.freeSpinsAwarded} free spins awarded.`);
}

console.log(`Payout: ${result.totalPayout} coins (wild ×${result.wildMultiplier})`);
```

---

## See Also

- [Public API](../04-API-Reference/01-Public-API.md) — `spin` signature, `Bet` constraints, and `SpinResult` fields
- [Types and Interfaces](../04-API-Reference/03-Types-and-Interfaces.md) — `Symbol`, `LineWin`, `FreeSpinState`, and `SpinResult` definitions
- [Core Concepts](../02-Architecture/02-Core-Concepts.md) — Paylines, scatter logic, and the wild multiplier model
- [Common Workflows](../03-Guides/01-Common-Workflows.md) — Everyday usage patterns
- [Troubleshooting](../03-Guides/03-Troubleshooting.md) — Diagnosing unexpected payout or RTP drift