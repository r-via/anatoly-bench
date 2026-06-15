# Configuration Schema

> Reference for all runtime parameters, internal constants, and hard-coded values that govern slot-engine behaviour.

## Overview

`slot-engine` has no external configuration file or environment variables. All engine behaviour is defined by compile-time constants baked into the source modules. The only value a caller supplies at runtime is the `Bet` — an integer coin amount passed to `spin()`. This page documents every configurable constant, the `Bet` constraint, the paytable, the reel-weight distribution, and the payline layout so that developers understand the full parameter space before forking or extending the engine.

---

## `Bet` — Runtime Parameter

`Bet` is the sole input accepted at runtime. It is declared in `src/engine.ts` and re-exported from `src/index.ts`.

```typescript
export type Bet = number; // integer, 1 – 100 (inclusive)
```

| Constraint | Value | Enforcement |
|---|---|---|
| Minimum | `1` | Hard error — `spin()` throws `"invalid bet"` |
| Maximum | `100` | Soft warning — `console.warn` is emitted; spin proceeds |
| Type | Integer | Non-integers throw `"invalid bet"` |

The total bet is divided equally across all ten paylines, so each payline receives a `lineBet` of `bet / 10` coins.

---

## House Edge and RTP

Defined in `src/engine.ts`:

```typescript
const HOUSE_EDGE = 0.05; // 5 % house edge → ~95 % theoretical RTP
```

`computePayout` applies this factor to every non-zero line-win total:

```typescript
total = total * (1 + HOUSE_EDGE); // boosts displayed payout; net RTP ~95 %
total += bet * 0.01;              // minimum-return floor: 1 % of bet
return Math.ceil(total);
```

The exported constant `ANCIENT_RTP = 0.95` in `src/paytable.ts` mirrors this target for reference use.

---

## Debug Mode

Defined in `src/engine.ts`:

```typescript
const DEBUG_MODE = false;
```

When `true`, every call to `spin()` logs the raw reel grid, line wins, and total payout to `console.log`. There is no runtime toggle; this flag must be changed at the source level and rebuilt.

---

## Paytable

Defined in `src/paytable.ts`. The table maps each paying symbol to a tuple of `[3-of-a-kind, 4-of-a-kind, 5-of-a-kind]` multipliers. The multiplier is applied to `lineBet`.

| Symbol | 3-of-a-kind | 4-of-a-kind | 5-of-a-kind |
|---|---|---|---|
| `CHERRY` | ×2 | ×5 | ×25 |
| `LEMON` | ×2 | ×5 | ×25 |
| `BELL` | ×5 | ×20 | ×100 |
| `BAR` | ×10 | ×40 | ×200 |
| `SEVEN` | ×25 | ×100 | ×500 |
| `DIAMOND` | ×50 | ×250 | ×1000 |

`WILD` and `SCATTER` are not pay symbols and return a multiplier of `0` from `getPayMultiplier`. `WILD` substitutes for any pay symbol and applies an additional bonus (see [Wild Multiplier](#wild-multiplier) below).

---

## Wild Multiplier

Defined in `src/wild.ts` and applied inside `evaluateLine` in `src/engine.ts`.

When one or more `WILD` symbols appear within a winning run, the base line payout is amplified:

```
adjustedPayout = basePayout × (1 + wildCount) × 2^wildCount
```

| WILDs in run | Multiplier factor |
|---|---|
| 0 | ×1 (no bonus) |
| 1 | ×4 |
| 2 | ×12 |
| 3 | ×32 |

`SpinResult.wildMultiplier` reports the highest wild-multiplier factor applied across all winning lines in a spin.

---

## Scatter and Free Spins

Defined in `src/freespin.ts`. Scatter detection counts every `SCATTER` symbol visible across the full 5×3 grid (not restricted to paylines).

| Scatter count | Effect |
|---|---|
| < 3 | No effect |
| ≥ 3 (first trigger) | Awards **10 free spins** (`freeSpinsAwarded = 10`) |
| ≥ 3 (during free spins) | Adds **10 more** to the remaining count |

The number of free spins awarded is reflected in `SpinResult.freeSpinsAwarded`. The engine reports this value but does not automatically re-invoke `spin()` — callers are responsible for consuming awarded free spins.

---

## Progressive Jackpot

Defined in `src/jackpot.ts`. The jackpot is determined by counting `DIAMOND` symbols anywhere on the 5×3 grid:

| DIAMOND count | Jackpot |
|---|---|
| < 4 | `jackpotHit: false` |
| ≥ 4 | `jackpotHit: true` |

There is no jackpot payout amount built into the engine. `SpinResult.jackpotHit` signals the event; the prize amount is left to the caller.

---

## Reel Symbol Weights

Defined in `src/reels.ts`. All five reels share the same weight distribution (`DEFAULT_WEIGHTS`). Weights are relative integers; the probability of each symbol equals its weight divided by the sum of all weights (total: **120**).

| Symbol | Weight | Approximate probability |
|---|---|---|
| `CHERRY` | 25 | 20.8 % |
| `LEMON` | 25 | 20.8 % |
| `BELL` | 15 | 12.5 % |
| `BAR` | 10 | 8.3 % |
| `SEVEN` | 5 | 4.2 % |
| `DIAMOND` | 30 | 25.0 % |
| `WILD` | 5 | 4.2 % |
| `SCATTER` | 5 | 4.2 % |

---

## Paylines

Ten left-to-right paylines are evaluated per spin. Each payline is expressed as a row-index array of length 5 (one entry per reel column, 0 = top row, 1 = middle, 2 = bottom).

```typescript
const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1], // line 0 — middle horizontal
  [0, 0, 0, 0, 0], // line 1 — top horizontal
  [2, 2, 2, 2, 2], // line 2 — bottom horizontal
  [0, 1, 2, 1, 0], // line 3 — V-shape
  [2, 1, 0, 1, 2], // line 4 — inverted V
  [0, 0, 1, 2, 2], // line 5 — diagonal down
  [2, 2, 1, 0, 0], // line 6 — diagonal up
  [1, 0, 1, 2, 1], // line 7 — zigzag low
  [1, 2, 1, 0, 1], // line 8 — zigzag high
  [0, 1, 0, 1, 0], // line 9 — top-middle alternating
];
```

A line win requires a run of **≥ 3** identical (or WILD-substituted) symbols starting from the leftmost reel. Lines with fewer than 3 matching symbols pay nothing.

---

## Examples

### Interpreting a Spin Against the Schema

```typescript
import { spin } from "slot-engine";

// Place a 50-coin bet (lineBet = 5 coins per payline).
const result = spin(50);

// Check jackpot (≥ 4 DIAMOND anywhere on the grid).
if (result.jackpotHit) {
  console.log("Jackpot! Award the prize pool.");
}

// Check free spins awarded (triggered by ≥ 3 SCATTER symbols).
if (result.freeSpinsAwarded > 0) {
  console.log(`${result.freeSpinsAwarded} free spins awarded.`);
  // Caller is responsible for invoking spin() that many more times.
}

// Wild multiplier applied this spin.
console.log("Wild multiplier:", result.wildMultiplier); // e.g. 4, 12, 32, or 1

// Iterate winning lines with their individual payouts.
for (const win of result.lineWins) {
  console.log(
    `Line ${win.lineIndex}: ${win.count}x ${win.symbol} → ${win.payout} coins`
  );
}

console.log("Total payout:", result.totalPayout);
```

### Bet Validation Behaviour

```typescript
import { spin } from "slot-engine";

// Valid bets
spin(1);   // minimum — ok
spin(100); // maximum — ok (no warning)

// Edge cases
spin(101); // console.warn("bet exceeds maximum"); spin proceeds
spin(0);   // throws "invalid bet"
spin(1.5); // throws "invalid bet" (non-integer)
```

---

## See Also

- [Public API](04-API-Reference/01-Public-API.md) — `spin()` signature and `SpinResult` field descriptions
- [Types and Interfaces](04-API-Reference/03-Types-and-Interfaces.md) — `Bet`, `Symbol`, `LineWin`, `SpinResult`, and `FreeSpinState` type definitions
- [Core Concepts](02-Architecture/02-Core-Concepts.md) — Glossary of domain terms (payline, scatter, wild, RTP)
- [Data Flow](02-Architecture/03-Data-Flow.md) — How constants flow through the spin evaluation pipeline