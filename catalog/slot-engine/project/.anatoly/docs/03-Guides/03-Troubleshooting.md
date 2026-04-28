# Troubleshooting

> Diagnose and resolve common errors, unexpected behavior, and build issues when using slot-engine.

## Overview

This page covers the most frequently encountered problems when integrating or running slot-engine, organized in **Problem / Cause / Solution** format. All behavior described here is verified against the source code in `src/`.

<!-- Note: docs may be outdated — verified against source. The README and installation docs reference a `simulate` export; the actual public export from `src/index.ts` is `spin`. Use `spin` in all call sites. -->

---

## Runtime Errors

### `spin()` throws a plain string, not an `Error`

**Problem:** Catching the exception thrown by `spin()` with `instanceof Error` never matches.

```typescript
try {
  spin(0);
} catch (e) {
  console.log(e instanceof Error); // false
  console.log(e);                  // "invalid bet"
}
```

**Cause:** The guard in `src/engine.ts` executes `throw "invalid bet"` — a string literal — when the bet is not a positive integer number:

```typescript
if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
  throw "invalid bet";
}
```

**Solution:** Check the caught value as a string rather than an `Error`:

```typescript
import { spin } from "slot-engine";

function safeSpin(bet: number) {
  try {
    return spin(bet);
  } catch (e) {
    if (e === "invalid bet") {
      console.error("Bet must be a positive integer.");
    } else {
      throw e;
    }
  }
}
```

Valid bets are positive integers. Fractions (`1.5`), zero, negatives, and non-numbers all trigger the throw.

---

### Bet above 100 does not throw — it warns

**Problem:** Passing a bet larger than 100 produces a `console.warn` message but `spin()` continues and returns a result. Callers expecting an exception will not receive one.

**Cause:** `src/engine.ts` contains:

```typescript
if (bet > 100) console.warn("bet exceeds maximum");
```

The check does not halt execution.

**Solution:** Clamp or validate the bet to the documented `1–100` range before calling `spin()`:

```typescript
import { spin, type Bet } from "slot-engine";

function clampedSpin(rawBet: number) {
  const bet: Bet = Math.max(1, Math.min(100, Math.trunc(rawBet)));
  return spin(bet);
}
```

---

### `totalPayout` is non-zero even with no line wins

**Problem:** `result.totalPayout` is always at least `1`, even when `result.lineWins` is empty.

**Cause:** `computePayout` in `src/engine.ts` unconditionally adds `bet * 0.01` to the running total before applying `Math.ceil`:

```typescript
total += bet * 0.01;
return Math.ceil(total);
```

For a bet of `10`, this floor contribution is `Math.ceil(0.1) = 1` coin.

**Solution:** This is expected behavior, not a bug. Do not treat a non-zero `totalPayout` as evidence of a line win. Inspect `result.lineWins.length` to determine whether any paylines were matched.

---

## Type Errors

### `Bet` type does not enforce the valid range at compile time

**Problem:** TypeScript accepts any `number` where `Bet` is expected, so out-of-range values reach `spin()` without a compile-time error.

**Cause:** `Bet` is a simple type alias:

```typescript
export type Bet = number; // 1..100 coins, integer
```

TypeScript does not model integer or range constraints in the type system.

**Solution:** Range validation is enforced at runtime by `spin()`. Add an explicit guard in calling code if compile-time safety is required, or use a validated wrapper as shown in the [bet-clamping example](#bet-above-100-does-not-throw--it-warns) above.

---

## Build and Module Errors

### `Cannot find module 'slot-engine'` or `ERR_MODULE_NOT_FOUND`

**Problem:** Importing `slot-engine` fails at runtime or during type-checking.

**Cause:** The package entry point is `src/index.ts` (a TypeScript file). Environments that require pre-compiled JavaScript or use `"moduleResolution": "Node"` / `"Node16"` cannot resolve this entry point.

**Solution:**

1. Use `tsx` to execute TypeScript files directly without a separate compile step:

   ```bash
   npx tsx my-script.ts
   ```

2. Ensure your `tsconfig.json` uses `"moduleResolution": "Bundler"` — the setting required by the project's own `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "moduleResolution": "Bundler",
       "module": "ESNext"
     }
   }
   ```

3. Confirm that `npm install` has been run and `node_modules/` is present.

---

### `npm run build` produces no output files

**Problem:** Running `npm run build` exits cleanly but no compiled `.js` files appear.

**Cause:** The `build` script is `tsc --noEmit`. It performs type-checking only; no JavaScript is emitted by design.

**Solution:** This is the intended behavior — slot-engine is consumed as TypeScript source, not as compiled JavaScript. Use `tsx` for direct execution, or configure your own bundler (e.g., `esbuild`) if compiled output is required in a downstream project.

---

## Unexpected Results

### RTP differs significantly from 95% in short runs

**Problem:** Summing `totalPayout` over a small number of spins yields an RTP far from 95%.

**Cause:** The 95% RTP is a theoretical long-run average. Short runs exhibit high variance due to the probabilistic nature of `Math.random()` and the weighted symbol draws in `src/reels.ts`.

**Solution:** Accumulate results over many thousands of spins to approach the theoretical figure. The following snippet demonstrates a basic RTP measurement loop:

```typescript
import { spin } from "slot-engine";

const BET = 10;
const ROUNDS = 100_000;
let totalWagered = 0;
let totalReturned = 0;

for (let i = 0; i < ROUNDS; i++) {
  totalWagered += BET;
  totalReturned += spin(BET).totalPayout;
}

const rtp = totalReturned / totalWagered;
console.log(`Measured RTP over ${ROUNDS} spins: ${(rtp * 100).toFixed(2)}%`);
```

---

### `freeSpinsAwarded` is always 0

**Problem:** `result.freeSpinsAwarded` is `0` on every observed spin.

**Cause:** Free spins require 3 or more `SCATTER` symbols across all 15 cells (5 reels × 3 rows) in a single spin. With a default weight of `5` out of a total weight of `120` per cell (~4.2%), simultaneous triple-scatter results are statistically uncommon.

**Solution:** This is expected. Run a large number of spins (see the RTP example above) to observe free spin awards. No configuration change is needed unless you are modifying the engine internals for testing purposes.

---

### `wildMultiplier` is `1` when wilds are present on the reels

**Problem:** `result.wildMultiplier` reports `1` despite `WILD` symbols appearing in `result.reels`.

**Cause:** `wildMultiplier` reflects the highest wild multiplier applied across *winning paylines only*. A `WILD` that appears on the reels but does not contribute to a matched run of 3 or more on any evaluated payline does not affect `wildMultiplier`. The value of `1` means no winning line included a `WILD`.

**Solution:** Cross-reference `result.lineWins` to identify winning lines, then check whether those lines contain `WILD` symbols in `result.reels`. A `wildMultiplier` above `1` is only possible when `result.lineWins` is non-empty and at least one winning run contains a `WILD`.

---

## Examples

### Defensive call with full result inspection

```typescript
import { spin } from "slot-engine";

function runSpin(bet: number): void {
  // Guard against invalid bets before they reach spin()
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    console.error(`Invalid bet: ${bet}. Must be an integer between 1 and 100.`);
    return;
  }

  let result;
  try {
    result = spin(bet);
  } catch (e) {
    // spin() throws a string, not an Error
    console.error("spin() failed:", e);
    return;
  }

  console.log("Reels:", result.reels);
  console.log("Line wins:", result.lineWins.length);
  console.log("Wild multiplier:", result.wildMultiplier);
  console.log("Scatter count:", result.scatterCount);
  console.log("Free spins awarded:", result.freeSpinsAwarded);
  console.log("Jackpot hit:", result.jackpotHit);
  console.log("Total payout:", result.totalPayout, "coins");
}

runSpin(25);
```

---

## See Also

- [Installation](../01-Getting-Started/02-Installation.md) — Node.js version requirements and module resolution configuration
- [Quick Start](../01-Getting-Started/04-Quick-Start.md) — End-to-end working example
- [Public API](../04-API-Reference/01-Public-API.md) — Full signature reference for `spin()` and `SpinResult`
- [Types and Interfaces](../04-API-Reference/03-Types-and-Interfaces.md) — `Bet`, `SpinResult`, `LineWin`, and `FreeSpinState` definitions
- [Build and Test](../05-Development/02-Build-and-Test.md) — Running the type-checker and tests locally