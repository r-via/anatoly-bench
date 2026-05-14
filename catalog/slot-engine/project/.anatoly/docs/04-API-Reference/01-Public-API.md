# Public API

> Complete reference for every function and type exported from `slot-engine`.

## Overview

`slot-engine` exposes a single entry point — `src/index.ts` — which re-exports the `spin` function together with the `Bet` and `SpinResult` types. All game logic (reel generation, payline evaluation, wild multipliers, scatter detection, and jackpot assessment) executes synchronously inside `spin` and the full outcome is returned as a plain `SpinResult` object.

<!-- Note: docs may be outdated — verified against source. The README refers to a function named `simulate`; the actual exported name is `spin`. -->

## Exported Symbols

| Symbol | Kind | Source module |
|---|---|---|
| `spin` | function | `src/engine.ts` |
| `Bet` | type alias | `src/engine.ts` |
| `SpinResult` | interface | `src/types.ts` |

---

## `spin`

```typescript
function spin(bet: Bet): SpinResult
```

Executes one complete slot spin. The function:

1. Validates `bet` (throws if invalid).
2. Builds five 3-symbol reels using `StandardReelBuilderFactory`.
3. Evaluates ten left-to-right paylines against the reel grid.
4. Applies wild-symbol multipliers to each winning line.
5. Detects SCATTER symbols and awards free spins when three or more appear.
6. Detects the progressive jackpot (four or more DIAMOND symbols anywhere on the grid).
7. Computes the total coin payout via `computePayout`, which applies the 5 % house-edge adjustment and returns a ceiling-rounded integer.
8. Passes the assembled `SpinResult` through `DefaultStrategy.adjustPayout`.

### Parameters

| Parameter | Type | Constraints | Description |
|---|---|---|---|
| `bet` | `Bet` (`number`) | Integer, 1–100 | Coin wager for this spin. Values above 100 emit a `console.warn` but are still processed. |

### Returns

A fully-populated [`SpinResult`](#spinresult) object. The call is synchronous and never returns `null` or `undefined`.

### Throws

Throws the string `"invalid bet"` when `bet` is not a positive integer.

### Example

```typescript
import { spin } from "slot-engine";

const result = spin(25);

console.log("Payout:", result.totalPayout);
console.log("Jackpot:", result.jackpotHit);
console.log("Free spins awarded:", result.freeSpinsAwarded);

// Inspect individual line wins
for (const win of result.lineWins) {
  console.log(
    `  Line ${win.lineIndex}: ${win.count}x ${win.symbol} → ${win.payout} coins`
  );
}
```

**Sample output** (results vary by RNG):

```
Payout: 14
Jackpot: false
Free spins awarded: 0
  Line 2: 3x BELL → 12.5 coins
```

---

## `Bet`

```typescript
type Bet = number;
```

A plain `number` type alias that represents a coin wager. Valid values are **integers in the range 1–100 inclusive**. The constraint is enforced at runtime inside `spin`; TypeScript does not narrow the alias further.

---

## `SpinResult`

```typescript
interface SpinResult {
  reels:             ReadonlyArray<ReadonlyArray<Symbol>>;
  lineWins:          ReadonlyArray<LineWin>;
  wildMultiplier:    number;
  scatterCount:      number;
  freeSpinsAwarded:  number;
  jackpotHit:        boolean;
  totalPayout:       number;
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `reels` | `ReadonlyArray<ReadonlyArray<Symbol>>` | Five columns, each containing three `Symbol` values in row order (top → bottom). Indices are `reels[col][row]`. |
| `lineWins` | `ReadonlyArray<LineWin>` | One entry per winning payline. Empty when no lines win. |
| `wildMultiplier` | `number` | Highest wild-boost multiplier across all winning lines. Equals `1` when no wilds contributed to any win. The formula per win is `(1 + wildCount) × 2^wildCount`. |
| `scatterCount` | `number` | Total SCATTER symbols visible anywhere on the 5 × 3 grid. |
| `freeSpinsAwarded` | `number` | Free spins credited this spin (10 per trigger; 0 when fewer than three scatters appeared). |
| `jackpotHit` | `boolean` | `true` when four or more DIAMOND symbols appear anywhere on the grid. |
| `totalPayout` | `number` | Ceiling-rounded coin payout after house-edge adjustment. |

---

## `LineWin`

`LineWin` is part of the public surface (imported from `src/types.ts` and present on `SpinResult.lineWins`) even though it is not explicitly re-exported from `src/index.ts`. It can be referenced through the `SpinResult` type.

```typescript
interface LineWin {
  lineIndex: number;
  symbol:    Symbol;
  count:     number;
  payout:    number;
}
```

| Field | Description |
|---|---|
| `lineIndex` | Zero-based index of the winning payline (0–9). |
| `symbol` | The non-wild symbol that anchored the run. |
| `count` | Length of the matching run (3, 4, or 5). |
| `payout` | Coin payout for this line after wild-multiplier boost, before house-edge rounding. |

---

## Payline Layout

Ten fixed paylines are evaluated on every spin. Each entry in the array below is a row index `[0, 1, 2]` for columns 0–4.

| Index | Pattern |
|---|---|
| 0 | `[1, 1, 1, 1, 1]` — middle row |
| 1 | `[0, 0, 0, 0, 0]` — top row |
| 2 | `[2, 2, 2, 2, 2]` — bottom row |
| 3 | `[0, 1, 2, 1, 0]` — V-shape |
| 4 | `[2, 1, 0, 1, 2]` — inverted V |
| 5 | `[0, 0, 1, 2, 2]` — diagonal down-right |
| 6 | `[2, 2, 1, 0, 0]` — diagonal up-right |
| 7 | `[1, 0, 1, 2, 1]` — zigzag |
| 8 | `[1, 2, 1, 0, 1]` — inverted zigzag |
| 9 | `[0, 1, 0, 1, 0]` — wave |

---

## Paytable Reference

Base multipliers before wild-boost, applied per line-bet (`bet / 10`):

| Symbol | 3-of-a-kind | 4-of-a-kind | 5-of-a-kind |
|---|---|---|---|
| CHERRY | 2× | 5× | 25× |
| LEMON | 2× | 5× | 25× |
| BELL | 5× | 20× | 100× |
| BAR | 10× | 40× | 200× |
| SEVEN | 25× | 100× | 500× |
| DIAMOND | 50× | 250× | 1,000× |

WILD and SCATTER symbols have no direct paytable entry.

---

## Examples

### Basic spin

```typescript
import { spin } from "slot-engine";

const result = spin(10);
console.log(result.totalPayout); // e.g. 0 (no win) or a positive integer
```

### Checking for a jackpot

```typescript
import { spin } from "slot-engine";

const result = spin(100);

if (result.jackpotHit) {
  console.log("JACKPOT! Four or more diamonds on the grid.");
}
```

### Running multiple spins and summing payouts

```typescript
import { spin, type SpinResult } from "slot-engine";

let totalIn  = 0;
let totalOut = 0;

for (let i = 0; i < 10_000; i++) {
  const result: SpinResult = spin(10);
  totalIn  += 10;
  totalOut += result.totalPayout;
}

const rtp = totalOut / totalIn;
console.log(`Observed RTP over 10 000 spins: ${(rtp * 100).toFixed(2)}%`);
// Approaches ~95% over a large sample.
```

### Inspecting reel state

```typescript
import { spin } from "slot-engine";

const { reels } = spin(5);

// reels[col][row] — 5 columns × 3 rows
for (let col = 0; col < 5; col++) {
  console.log(`Reel ${col + 1}:`, reels[col].join(" | "));
}
// e.g. "Reel 1: CHERRY | SEVEN | WILD"
```

---

## Error Handling

`spin` throws a string (not an `Error` object) when the bet argument fails validation:

```typescript
import { spin } from "slot-engine";

try {
  spin(0);          // below minimum
} catch (err) {
  console.error(err); // "invalid bet"
}

try {
  spin(1.5);        // non-integer
} catch (err) {
  console.error(err); // "invalid bet"
}
```

Bets above 100 do **not** throw; they log a warning to `console.warn` and continue.

---

## See Also

- [Types and Interfaces](04-API-Reference/03-Types-and-Interfaces.md) — Full listing of all public TypeScript types
- [Configuration Schema](04-API-Reference/02-Configuration-Schema.md) — Engine configuration options
- [Core Concepts](02-Architecture/02-Core-Concepts.md) — Glossary of domain terms (Symbol, payline, scatter, wild)
- [Data Flow](02-Architecture/03-Data-Flow.md) — How a bet moves through the engine pipeline
- [Quick Start](01-Getting-Started/04-Quick-Start.md) — End-to-end tutorial