# Quick Start

> A complete end-to-end walkthrough of installing slot-engine and running your first spin in under five minutes.

## Overview

This guide covers installing the package, calling `spin()` with a bet amount, and interpreting every field of the returned `SpinResult`. No external services or configuration files are required — the engine is pure game logic that runs entirely in-process.

<!-- Note: docs may be outdated — verified against source. The README shows `simulate` as the entry point; the actual export is `spin`. -->

## Prerequisites

- **Node.js** — any version that supports ES modules and TypeScript compilation via `tsc`.
- **npm** — bundled with Node.js.

## Step 1 — Install

```bash
npm install slot-engine
```

## Step 2 — Run Your First Spin

Import `spin` and pass an integer bet between 1 and 100 coins (inclusive).

```typescript
import { spin } from "slot-engine";

const result = spin(10); // 10-coin bet

console.log("Total payout:", result.totalPayout);
console.log("Jackpot hit:", result.jackpotHit);
console.log("Free spins awarded:", result.freeSpinsAwarded);
```

`spin()` is synchronous and returns a fully resolved `SpinResult` immediately.

## Step 3 — Inspect the Result

`SpinResult` exposes the complete outcome of a single spin:

| Field | Type | Description |
|---|---|---|
| `reels` | `ReadonlyArray<ReadonlyArray<Symbol>>` | 5-column × 3-row grid of symbols produced by this spin. |
| `lineWins` | `ReadonlyArray<LineWin>` | Each evaluated payline that produced a win. |
| `wildMultiplier` | `number` | Highest wild multiplier applied across all winning lines; `1` when no wilds contributed. |
| `scatterCount` | `number` | Total `SCATTER` symbols visible across all reels. |
| `freeSpinsAwarded` | `number` | Number of free spins triggered (`0` when the scatter threshold was not met). |
| `jackpotHit` | `boolean` | `true` when the progressive jackpot condition was satisfied. |
| `totalPayout` | `number` | Coin payout after applying line wins, wild multipliers, and the house edge. |

## Step 4 — Iterate Over Winning Lines

Each entry in `lineWins` is a `LineWin` object describing an individual payline win:

```typescript
import { spin, type SpinResult, type LineWin } from "slot-engine";

const result: SpinResult = spin(25);

for (const win of result.lineWins) {
  console.log(
    `Line ${win.lineIndex}: ${win.count}× ${win.symbol} → ${win.payout} coins`
  );
}
```

## Step 5 — Handle Special Outcomes

```typescript
import { spin } from "slot-engine";

const result = spin(50);

if (result.jackpotHit) {
  console.log("JACKPOT! Payout:", result.totalPayout);
}

if (result.freeSpinsAwarded > 0) {
  console.log(`${result.freeSpinsAwarded} free spins triggered!`);
  // Trigger additional spins at the same bet level
  for (let i = 0; i < result.freeSpinsAwarded; i++) {
    const freeResult = spin(50);
    console.log("Free spin payout:", freeResult.totalPayout);
  }
}
```

## Step 6 — Verify the Build

```bash
npm run build
```

This runs `tsc --noEmit` to type-check the project without emitting output files. A clean exit confirms the source compiles correctly.

## Examples

### Simulating Multiple Spins

```typescript
import { spin, type SpinResult } from "slot-engine";

const BET = 10;
const ROUNDS = 1_000;
let totalIn = 0;
let totalOut = 0;

for (let i = 0; i < ROUNDS; i++) {
  const result: SpinResult = spin(BET);
  totalIn += BET;
  totalOut += result.totalPayout;
}

const empiricalRtp = totalOut / totalIn;
console.log(`Empirical RTP over ${ROUNDS} rounds: ${(empiricalRtp * 100).toFixed(2)}%`);
// Expected to approach 95% over a large sample.
```

### Printing the Reel Grid

```typescript
import { spin } from "slot-engine";

const { reels } = spin(5);

// reels[col][row] — 5 columns, 3 rows each
for (let row = 0; row < 3; row++) {
  const rowDisplay = reels.map(col => col[row].padEnd(7)).join(" | ");
  console.log(rowDisplay);
}
```

## See Also

- [Overview](01-Getting-Started/01-Overview.md) — What the engine does and its design goals.
- [Installation](01-Getting-Started/02-Installation.md) — Detailed install options and prerequisites.
- [Public API](04-API-Reference/01-Public-API.md) — Full reference for `spin()` including error behaviour and bet validation.
- [Types and Interfaces](04-API-Reference/03-Types-and-Interfaces.md) — Complete definitions for `SpinResult`, `LineWin`, `Symbol`, and `Bet`.
- [Common Workflows](03-Guides/01-Common-Workflows.md) — Step-by-step guides for frequent use cases such as batch simulation and RTP analysis.