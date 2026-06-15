# Common Workflows

> Step-by-step guides for frequent slot-engine use cases, including batch simulation, RTP analysis, reel inspection, and free-spin tracking.

## Overview

This page documents the most common tasks performed with slot-engine. Each workflow is self-contained and uses only the public `spin()` function and the types exported from the package. No external services or configuration files are required.

All examples import from `"slot-engine"`. The canonical entry point exports `spin`, `SpinResult`, and `LineWin`. The `Bet` type alias is `number` (integer, 1–100 inclusive).

> **Note:** The README refers to an entry point named `simulate`. The actual exported function is `spin`. See [Public API](../04-API-Reference/01-Public-API.md) for the authoritative signature.

---

## Workflow 1 — Run a Single Spin and Inspect the Result

The simplest usage: call `spin()` with an integer bet and read the returned `SpinResult`.

### Steps

1. Import `spin` from `"slot-engine"`.
2. Call `spin(bet)` with an integer between 1 and 100 coins.
3. Read `totalPayout` for the coin outcome.
4. Check `jackpotHit` and `freeSpinsAwarded` for special outcomes.

```typescript
import { spin } from "slot-engine";

const result = spin(10); // 10-coin bet

console.log("Payout:", result.totalPayout);
console.log("Jackpot:", result.jackpotHit);
console.log("Free spins awarded:", result.freeSpinsAwarded);
console.log("Wild multiplier:", result.wildMultiplier);
console.log("Scatter count:", result.scatterCount);
```

`spin()` is synchronous; there are no promises or callbacks to handle.

---

## Workflow 2 — Iterate Over Winning Lines

`SpinResult.lineWins` is a read-only array of `LineWin` objects, one per winning payline. Each describes the symbol, the run length, and the coin payout for that line.

### Steps

1. Call `spin(bet)`.
2. Iterate `result.lineWins`.
3. Access `lineIndex`, `symbol`, `count`, and `payout` on each entry.

```typescript
import { spin, type SpinResult, type LineWin } from "slot-engine";

const result: SpinResult = spin(25);

if (result.lineWins.length === 0) {
  console.log("No winning lines this spin.");
} else {
  for (const win of result.lineWins) {
    console.log(
      `Payline ${win.lineIndex}: ${win.count}× ${win.symbol} → ${win.payout} coins`
    );
  }
}
```

The engine evaluates ten left-to-right paylines. `lineIndex` is zero-based (0–9). A run of 3, 4, or 5 matching symbols (with `WILD` substitution) produces a win.

---

## Workflow 3 — Print the Reel Grid

`SpinResult.reels` is a 5-column × 3-row read-only grid accessed as `reels[col][row]`. Each cell contains a `Symbol` string.

### Steps

1. Destructure `reels` from the `spin()` return value.
2. Iterate rows (0–2) and columns (0–4) to render the grid.

```typescript
import { spin } from "slot-engine";

const { reels } = spin(5);

// Print a 3-row display; reels[col][row]
for (let row = 0; row < 3; row++) {
  const line = reels.map(col => col[row].padEnd(8)).join("| ");
  console.log(line);
}
```

Example output:

```text
CHERRY  | WILD    | BELL    | BAR     | LEMON
SEVEN   | CHERRY  | LEMON   | CHERRY  | BELL
BAR     | BAR     | WILD    | SEVEN   | CHERRY
```

Valid symbol values are: `CHERRY`, `LEMON`, `BELL`, `BAR`, `SEVEN`, `DIAMOND`, `WILD`, `SCATTER`.

---

## Workflow 4 — Handle Free Spins

When three or more `SCATTER` symbols appear across all reels in a single spin, `freeSpinsAwarded` is set to `10`. The engine does not execute free spins automatically; the caller is responsible for performing the additional spins.

### Steps

1. Call `spin(bet)` for the triggering spin.
2. Check `result.freeSpinsAwarded > 0`.
3. Loop for the awarded count, calling `spin(bet)` each time.
4. Accumulate payouts from each free spin result.

```typescript
import { spin } from "slot-engine";

const BET = 20;
const result = spin(BET);

let bonusPayout = 0;

if (result.freeSpinsAwarded > 0) {
  console.log(`${result.freeSpinsAwarded} free spins triggered!`);

  for (let i = 0; i < result.freeSpinsAwarded; i++) {
    const freeResult = spin(BET);
    bonusPayout += freeResult.totalPayout;
    console.log(`Free spin ${i + 1}: ${freeResult.totalPayout} coins`);
  }

  console.log("Total bonus payout:", bonusPayout);
}
```

Free spins themselves can also trigger `freeSpinsAwarded > 0`, in which case the same pattern applies recursively or iteratively depending on the game's rules.

---

## Workflow 5 — Batch Simulation and RTP Verification

To measure the engine's empirical Return-to-Player (RTP) over a large sample, run many spins and calculate the ratio of total payout to total bet. The engine targets a theoretical RTP of **95%**.

### Steps

1. Choose a bet amount and number of rounds.
2. Accumulate `totalIn` (sum of bets) and `totalOut` (sum of payouts).
3. Compute `totalOut / totalIn` after all rounds.

```typescript
import { spin, type SpinResult } from "slot-engine";

const BET = 10;
const ROUNDS = 100_000;

let totalIn = 0;
let totalOut = 0;
let jackpots = 0;
let freeSpinTriggers = 0;

for (let i = 0; i < ROUNDS; i++) {
  const result: SpinResult = spin(BET);
  totalIn += BET;
  totalOut += result.totalPayout;
  if (result.jackpotHit) jackpots++;
  if (result.freeSpinsAwarded > 0) freeSpinTriggers++;
}

const empiricalRtp = totalOut / totalIn;
console.log(`Rounds:          ${ROUNDS}`);
console.log(`Empirical RTP:   ${(empiricalRtp * 100).toFixed(2)}%`);
console.log(`Jackpot hits:    ${jackpots}`);
console.log(`Free spin triggers: ${freeSpinTriggers}`);
```

Over a sufficiently large sample (≥ 100 000 spins), the empirical RTP should approximate 95%.

---

## Workflow 6 — Detect the Progressive Jackpot

The jackpot fires when four or more `DIAMOND` symbols appear anywhere across the 5 × 3 reel grid in a single spin.

### Steps

1. Check `result.jackpotHit` after each `spin()` call.
2. React accordingly — e.g., display a jackpot screen or award a progressive pool.

```typescript
import { spin } from "slot-engine";

const result = spin(100); // maximum bet

if (result.jackpotHit) {
  console.log("PROGRESSIVE JACKPOT HIT!");
  console.log("Spin payout:", result.totalPayout);
}
```

`jackpotHit` is a boolean in `SpinResult`. The engine does not track a running jackpot pool; that logic belongs to the caller.

---

## Examples

### Complete Session Simulation

```typescript
import { spin, type SpinResult } from "slot-engine";

function runSession(bet: number, spins: number): void {
  let bankroll = 0;

  for (let i = 1; i <= spins; i++) {
    const result: SpinResult = spin(bet);
    bankroll += result.totalPayout - bet;

    const tags: string[] = [];
    if (result.jackpotHit) tags.push("JACKPOT");
    if (result.freeSpinsAwarded > 0) tags.push(`+${result.freeSpinsAwarded} FREE`);
    if (result.wildMultiplier > 1) tags.push(`x${result.wildMultiplier} WILD`);

    const label = tags.length > 0 ? ` [${tags.join(", ")}]` : "";
    console.log(`Spin ${i}: payout=${result.totalPayout}${label}`);
  }

  console.log(`\nNet bankroll change: ${bankroll > 0 ? "+" : ""}${bankroll} coins`);
}

runSession(10, 50);
```

## See Also

- [Quick Start](../01-Getting-Started/04-Quick-Start.md) — End-to-end tutorial for first-time users.
- [Public API](../04-API-Reference/01-Public-API.md) — Full reference for `spin()` including bet validation and error behaviour.
- [Types and Interfaces](../04-API-Reference/03-Types-and-Interfaces.md) — Complete definitions for `SpinResult`, `LineWin`, `Symbol`, and `Bet`.
- [Advanced Configuration](../03-Guides/02-Advanced-Configuration.md) — Tuning options and overrides.
- [Troubleshooting](../03-Guides/03-Troubleshooting.md) — Common errors and diagnostics.