# Configuration

> Documents all tuneable constants, payout strategies, and TypeScript compiler settings that govern slot-engine behaviour.

## Overview

slot-engine is a self-contained library with no external configuration files, no environment variables, and no CLI flags. All behaviour is controlled by compile-time constants embedded in the source modules. The sections below enumerate every constant, along with the `SpinStrategy` extension point that callers can use to post-process payout results at runtime.

<!-- Note: docs may be outdated — verified against source. The README references `simulate()`, but the source exports `spin()`. This page uses the authoritative source name. -->

## Engine Constants

The following constants are defined in `src/engine.ts` and apply to every call to `spin()`.

| Constant | Value | Effect |
|---|---|---|
| `HOUSE_EDGE` | `0.05` | Winning line payouts are multiplied by `1 + 0.05 = 1.05` before the house edge is applied to keep the long-run RTP at 95 %. |
| `DEBUG_MODE` | `false` | When `true`, each spin logs raw reel state and payout to `console.log`. |
| Payline count | `10` | The engine always evaluates all ten fixed paylines. |
| Bet distributed | `bet / 10` | Each payline receives an equal share of the total bet (`lineBet = bet / 10`). |

### Bet Limits

| Limit | Value | Enforcement |
|---|---|---|
| Minimum | `1` coin | `spin()` throws `"invalid bet"` for any value below `1`, any non-integer, or any non-number. |
| Recommended maximum | `100` coins | Values above `100` produce a `console.warn` but are not rejected. |

## Symbol Weights

Reel composition is configured in `src/reels.ts` via `DEFAULT_WEIGHTS`. All five reels share identical weights, giving a total weight of 120 per reel.

| Symbol | Weight | Approx. frequency |
|---|---|---|
| `CHERRY` | 25 | 20.8 % |
| `LEMON` | 25 | 20.8 % |
| `DIAMOND` | 30 | 25.0 % |
| `BELL` | 15 | 12.5 % |
| `BAR` | 10 | 8.3 % |
| `SEVEN` | 5 | 4.2 % |
| `WILD` | 5 | 4.2 % |
| `SCATTER` | 5 | 4.2 % |

## Pay Table

Base multipliers are defined in `src/paytable.ts`. The per-line payout is `multiplier × lineBet` where `lineBet = bet / 10`.

| Symbol | 3-of-a-kind | 4-of-a-kind | 5-of-a-kind |
|---|---|---|---|
| `CHERRY` | 2 | 5 | 25 |
| `LEMON` | 2 | 5 | 25 |
| `BELL` | 5 | 20 | 100 |
| `BAR` | 10 | 40 | 200 |
| `SEVEN` | 25 | 100 | 500 |
| `DIAMOND` | 50 | 250 | 1 000 |

`WILD` and `SCATTER` have no base multiplier. `WILD` instead amplifies the payout of the line it completes (see Wild Multiplier below).

## Bonus Feature Thresholds

These values are hardcoded in their respective source modules and are not overridable at runtime.

### Wild Multiplier (`src/wild.ts`)

When one or more `WILD` symbols appear in a winning run, the line payout is scaled by:

```
basePayout × (1 + wildCount) × 2^wildCount
```

| Wilds in run | Scale factor |
|---|---|
| 1 | ×4 |
| 2 | ×12 |
| 3 | ×32 |

### Free Spins (`src/freespin.ts`)

| Parameter | Value |
|---|---|
| Trigger symbol | `SCATTER` |
| Minimum scatter count | 3 across the entire 5×3 grid |
| Free spins awarded | 10 per trigger |
| Re-trigger | Yes — 3 or more additional scatters during free spins award 10 more |

### Jackpot (`src/jackpot.ts`)

| Parameter | Value |
|---|---|
| Trigger symbol | `DIAMOND` |
| Minimum count | 4 across the entire 5×3 grid |

## Payline Layout

Ten left-to-right paylines are fixed in `src/engine.ts`. Each entry is a row index (0 = top, 1 = middle, 2 = bottom) for reels 1–5.

```typescript
const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],  // 0 – centre horizontal
  [0, 0, 0, 0, 0],  // 1 – top horizontal
  [2, 2, 2, 2, 2],  // 2 – bottom horizontal
  [0, 1, 2, 1, 0],  // 3 – V-shape downward
  [2, 1, 0, 1, 2],  // 4 – V-shape upward
  [0, 0, 1, 2, 2],  // 5 – diagonal right
  [2, 2, 1, 0, 0],  // 6 – diagonal left
  [1, 0, 1, 2, 1],  // 7 – zigzag A
  [1, 2, 1, 0, 1],  // 8 – zigzag B
  [0, 1, 0, 1, 0],  // 9 – alternating top-mid
];
```

## Payout Strategy

`src/strategy.ts` exposes the `SpinStrategy` extension point. The engine internally applies `DefaultStrategy`, which returns results unmodified. `ConservativeStrategy` reduces `totalPayout` to 80 % of the computed value.

```typescript
import type { SpinResult } from "slot-engine";
import { SpinStrategy } from "./src/strategy.js";

class HighVolatilityStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    // Double every payout — for simulation/testing only.
    return { ...result, totalPayout: result.totalPayout * 2 };
  }
}
```

> **Note:** `spin()` always instantiates `DefaultStrategy` internally. To apply a custom strategy, wrap the return value of `spin()` manually using `strategy.adjustPayout(result)`.

## TypeScript Compiler Settings

`tsconfig.json` controls how the project is compiled. No build output is emitted (`noEmit: true`); type-checking is the sole purpose of the build script.

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

Key implications for consumers:

- `strict: true` — all engine types are strict-null-safe.
- `isolatedModules: true` — each file must be independently transpilable; type-only re-exports require the `type` keyword.
- `moduleResolution: "Bundler"` — import specifiers in source use `.js` extensions even for `.ts` files.

## Examples

### Validating a bet before calling `spin()`

```typescript
import { spin } from "slot-engine";

function safeSpin(bet: number) {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`bet must be an integer in 1..100, got ${bet}`);
  }
  return spin(bet);
}

const result = safeSpin(25);
console.log("Total payout:", result.totalPayout);
console.log("Jackpot hit:", result.jackpotHit);
console.log("Free spins awarded:", result.freeSpinsAwarded);
```

### Applying `ConservativeStrategy` post-spin

```typescript
import { spin } from "slot-engine";
import { ConservativeStrategy } from "./src/strategy.js";

const strategy = new ConservativeStrategy();
const raw = spin(50);
const conservative = strategy.adjustPayout(raw);

console.log("Raw payout:         ", raw.totalPayout);
console.log("Conservative payout:", conservative.totalPayout); // ~80 % of raw
```

### Inspecting line wins per payline

```typescript
import { spin } from "slot-engine";

const result = spin(10);

for (const win of result.lineWins) {
  console.log(
    `Line ${win.lineIndex}: ${win.count}× ${win.symbol} → ${win.payout} coins`
  );
}
```

## See Also

- [Quick Start](01-Getting-Started/04-Quick-Start.md) — end-to-end usage walkthrough
- [Public API](04-API-Reference/01-Public-API.md) — `spin()` signature and return type
- [Types and Interfaces](04-API-Reference/03-Types-and-Interfaces.md) — `SpinResult`, `LineWin`, `FreeSpinState`, `Symbol`
- [Core Concepts](02-Architecture/02-Core-Concepts.md) — glossary of domain terms (payline, wild, scatter, RTP)
- [Build and Test](05-Development/02-Build-and-Test.md) — running `tsc --noEmit`