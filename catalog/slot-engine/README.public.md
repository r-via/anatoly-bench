# slot-engine

A small 5-reel, 3-row slot machine engine in TypeScript. Pure game logic — no UI, no persistence, no networking.

## Install

```bash
npm install
```

## Usage

```ts
import { simulate } from "slot-engine";

const result = simulate(10); // 10-coin bet
console.log(result.totalPayout);
```

`simulate()` runs one full spin: it spins five reels, evaluates ten left-to-right paylines, applies wild multipliers, detects scatter bonuses (free spins) and the progressive jackpot, and returns the total coin payout along with the structured outcome.

## API

```ts
type Bet = number; // 1..100 coins, integer

interface SpinResult {
  reels: ReadonlyArray<ReadonlyArray<Symbol>>;
  lineWins: ReadonlyArray<LineWin>;
  wildMultiplier: number;
  scatterCount: number;
  freeSpinsAwarded: number;
  jackpotHit: boolean;
  totalPayout: number;
}

function simulate(bet: Bet): SpinResult;
```

## RTP

The engine targets a theoretical Return-to-Player of **95%**. Long-run player return approximates the bet-weighted house edge of 5%.

## Build

```bash
npm install
npx tsc --noEmit
```

## License

AGPL-3.0-only.
