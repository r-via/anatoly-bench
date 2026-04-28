# Overview

> A pure-logic TypeScript library for simulating a 5-reel, 3-row slot machine with paylines, wilds, scatters, and a progressive jackpot.

## Overview

`slot-engine` is a self-contained slot machine simulation library written in TypeScript. It implements the complete game-logic pipeline for a classic reel-based slot — from random symbol generation through payline evaluation, wild substitution and multiplier application, scatter detection, free-spin awarding, and jackpot resolution — and returns a fully structured result.

The library ships **no UI, no persistence layer, and no networking**. It is designed to serve as a deterministic, embeddable backend for games, simulators, or RTP-analysis tooling.

## What It Does

A single call to `spin()` performs the following steps in sequence:

1. **Reel generation** — five independent reels of three rows each are populated with weighted-random symbols.
2. **Payline evaluation** — ten left-to-right paylines are checked for runs of three or more matching symbols (with `WILD` substitution).
3. **Wild multiplier** — winning lines that include `WILD` symbols receive an exponential multiplier on top of the base payout.
4. **Scatter detection** — `SCATTER` symbols anywhere on the grid are counted regardless of payline position.
5. **Free-spin award** — sufficient scatter count triggers an award of free spins tracked in the result.
6. **Jackpot check** — a qualifying reel pattern activates the progressive jackpot flag.
7. **Payout calculation** — line-win payouts are aggregated and adjusted toward the target 95% RTP.

## Symbol Set

The engine uses eight distinct symbols:

| Symbol    | Role                                      |
|-----------|-------------------------------------------|
| `CHERRY`  | Standard paying symbol                    |
| `LEMON`   | Standard paying symbol                    |
| `BELL`    | Standard paying symbol                    |
| `BAR`     | Standard paying symbol                    |
| `SEVEN`   | Standard paying symbol                    |
| `DIAMOND` | Premium paying symbol                     |
| `WILD`    | Substitutes for paying symbols; multiplies wins |
| `SCATTER` | Triggers free spins regardless of payline |

## Return-to-Player

The engine targets a theoretical **RTP of 95%**. The house edge of 5% is enforced inside `computePayout()` and applied consistently across all bet sizes.

## Scope and Constraints

| In scope | Out of scope |
|----------|-------------|
| Spin simulation and outcome calculation | Rendering / display |
| 10-payline left-to-right evaluation | Persistence or session state |
| Wild substitution and exponential multipliers | Networking or real-money integration |
| Scatter-triggered free spins | Sound, animation, or UI assets |
| Progressive jackpot detection | Configurable RTP targets |

Valid bets are integers in the range **1–100 coins**. Fractional or out-of-range values cause `spin()` to throw.

## Examples

```typescript
import { spin } from "slot-engine";

// Run a single spin with a 10-coin bet
const result = spin(10);

console.log("Reels:", result.reels);
// e.g. [["CHERRY","WILD","LEMON"], ["BELL","BELL","BAR"], ...]

console.log("Line wins:", result.lineWins);
// e.g. [{ lineIndex: 0, symbol: "BELL", count: 3, payout: 12 }]

console.log("Wild multiplier:", result.wildMultiplier); // e.g. 4
console.log("Scatter count:", result.scatterCount);     // e.g. 2
console.log("Free spins awarded:", result.freeSpinsAwarded); // e.g. 0
console.log("Jackpot hit:", result.jackpotHit);         // e.g. false
console.log("Total payout:", result.totalPayout);       // e.g. 13
```

<!-- Note: docs may be outdated — verified against source. The README references `simulate()` but the actual exported function is `spin()`. -->

## See Also

- [Installation](02-Installation.md) — prerequisites and install steps
- [Quick Start](04-Quick-Start.md) — end-to-end tutorial from install to first spin
- [Public API](../04-API-Reference/01-Public-API.md) — full signature reference for `spin()` and `computePayout()`
- [Types and Interfaces](../04-API-Reference/03-Types-and-Interfaces.md) — `SpinResult`, `LineWin`, `Bet`, and all exported types
- [System Overview](../02-Architecture/01-System-Overview.md) — component diagram and module responsibilities
- [Core Concepts](../02-Architecture/02-Core-Concepts.md) — glossary and key domain definitions