[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcjackpotts) |

## 🔍 Details

### `src/engine.ts` — 4.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 12: Async/Promises/Error handling (HIGH)

- Replace `bet: any` with the already-defined `Bet` type alias in both exported functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance instead of a string to preserve stack trace and enable instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix the house edge formula: multiply by (1 - HOUSE_EDGE) to reduce payout to 95% RTP, not increase it
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Make PAYLINES immutable to prevent accidental mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies readonly (readonly number[])[];`
- Use satisfies for the SpinResult object literal to catch shape errors without widening
  - Before: `const result: SpinResult = {`
  - After: `const result = {
  reels,
  // ...
} satisfies SpinResult;`
- Add JSDoc to the spin() public export
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `/**
 * Runs one full spin: evaluates ten paylines, wild multipliers, scatters, and jackpot.
 * @param bet - Wager in coins (1..100, integer)
 */
export function spin(bet: Bet): SpinResult {`

### `src/paytable.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Use `satisfies` + `as const` for PAY_TABLE to lock literal keys and enforce readonly tuples
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY: [2, 5, 25],
  ...
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;`
- Mark `symbols` parameter as readonly to reflect the pure, non-mutating contract
  - Before: `export function lineWins(symbols: Symbol[]): ...`
  - After: `export function lineWins(symbols: readonly Symbol[]): ...`
- Add JSDoc to all public exports
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number { ... }

export function lineWins(symbols: Symbol[]): ... { ... }`
  - After: `/** Return-to-player ratio for ancient/classic machine configuration. */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the payout multiplier for `symbol` when `count` reels match.
 * Returns 0 for fewer than 3 matches or unknown symbols.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number { ... }

/**
 * Evaluates a single payline left-to-right treating WILDs as substitutes.
 * Returns the winning symbol + consecutive count, or null for no win.
 */
export function lineWins(symbols: readonly Symbol[]): ... { ... }`

### `src/reels.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's rng.ts module to satisfy regulated gaming RNG requirements and improve testability.
  - Before: `import type { Symbol } from "./types.js";

function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import type { Symbol } from "./types.js";
import { random } from "./rng.js";

function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = random() * total;`
- Use Record<Symbol, number> for ReelWeightConfig to eliminate manual key enumeration.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants readonly to prevent accidental mutation.
  - Before: `const SYMBOLS: Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
];

const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };

const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `const SYMBOLS: readonly Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const;

const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... } satisfies ReelWeightConfig;

const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];`
- Add bounds guard to spinReel and getReelWeights to surface invalid indices as descriptive errors rather than undefined-propagation crashes.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Accept an injectable rng function for testability and replace Math.random(). This also opens the door to a certified CSPRNG without changing callers.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const roll = rng() * totalWeight;`
- Replace Math.random() with a CSPRNG for regulated gaming use
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(2);
crypto.getRandomValues(buf);
const roll = ((buf[0] * 2 ** 32 + buf[1]) / 2 ** 64) * totalWeight;`
- Add input validation to prevent silent undefined returns
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new Error('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new Error('weightedPick: items and weights length mismatch');
  if (weights.some(w => w < 0)) throw new Error('weightedPick: weights must be non-negative');`

### `src/jackpot.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to the exported `isJackpotHit` function documenting the ≥4 DIAMOND threshold and the return contract.
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Returns true when four or more DIAMOND symbols appear across all reels,
 * triggering the progressive jackpot.
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
