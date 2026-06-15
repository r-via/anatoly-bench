[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcstrategyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` with the already-defined `Bet` type in both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object instead of a string to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the documented max-bet limit instead of silently warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum (1–100)");`
- Fix HOUSE_EDGE application — it currently inflates payouts by 5% (opposite of a house edge)
  - Before: `if (total > 0) {
  total = total * (1 + HOUSE_EDGE);
}`
  - After: `// Reduce via house edge so long-run return ≈ 95 %
// (paytable calibration carries most of the weight; this clips any residual)
if (total > 0) {
  total = total * (1 - HOUSE_EDGE);
}`
- Mark PAYLINES immutable with as const satisfies
  - Before: `const PAYLINES: number[][] = [...]`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies ReadonlyArray<readonly [number, number, number, number, number]>;`
- Add JSDoc to the exported spin function
  - Before: `export function spin(bet: Bet): SpinResult {`
  - After: `/**
 * Executes a single slot spin for the given bet amount (1–100 coins).
 * Returns the full spin result including line wins, scatter count, jackpot flag, and total payout.
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to auto-track symbol additions
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Enforce immutability on module-level constants and prevent external mutation via getReelWeights
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
const REEL_WEIGHTS: number[][] = [...];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = {...};
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];

export function getReelWeights(reelIndex: number): readonly number[] {
  return REEL_WEIGHTS[reelIndex];
}`
- Inject an RNG function into pickFromWeighted to replace Math.random() and enable testability + regulatory compliance
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add bounds guard to spinReel and getReelWeights
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Use satisfies for DEFAULT_WEIGHTS to retain literal types while enforcing shape
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, ...
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} as const satisfies ReelWeightConfig;`

### `src/strategy.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Mark the payout multiplier as a named constant and add JSDoc to ConservativeStrategy
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return {
      ...result,
      totalPayout: Math.floor(result.totalPayout * 0.8),
    };
  }
}`
  - After: `/** Multiplier applied to all payouts; yields approximately 76% RTP. Must match certified game-math submission. */
const CONSERVATIVE_PAYOUT_FACTOR = 0.8 as const;

/**
 * Conservative payout strategy — reduces total payout by 20%.
 * Use only in game modes whose certified RTP permits sub-95% returns.
 */
export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: Readonly<SpinResult>): SpinResult {
    return {
      ...result,
      totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_PAYOUT_FACTOR),
    };
  }
}`
- Use Readonly<SpinResult> on all adjustPayout parameters to prevent accidental mutation of primitive fields
  - Before: `adjustPayout(result: SpinResult): SpinResult {`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult {`

### `src/rng.ts` — 5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with a crypto-based draw to meet regulated gaming RNG requirements
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x1_0000_0000) * totalWeight;`
- Use readonly array parameters and add an injectable rng parameter for testability
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  },
): T {`
- Guard against empty items and zero total weight
  - Before: `const totalWeight = weights.reduce((sum, w) => sum + w, 0);
const roll = Math.random() * totalWeight;`
  - After: `if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
if (weights.length !== items.length) throw new RangeError('weightedPick: weights.length must equal items.length');
const totalWeight = weights.reduce((sum, w) => sum + w, 0);
if (totalWeight <= 0) throw new RangeError('weightedPick: total weight must be positive');
const roll = rng() * totalWeight;`
- Add @param and @returns JSDoc tags to the exported function
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 *
 * @param items - Array of items to pick from.
 * @param weights - Parallel array of non-negative weights (must sum > 0).
 * @param rng - Optional uniform [0,1) random source; defaults to crypto.getRandomValues.
 * @returns The selected item.
 */`

### `src/legacy.ts` — 7/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark input array as readonly to communicate no mutation and enable stricter callers.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Use integer milli-coin arithmetic to eliminate floating-point drift in gambling payouts.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// bet is in coins (1–100); lineBet in milli-coins avoids IEEE-754 drift
const lineBetMillis = bet * 100; // milli-coins: bet/10 × 1000
return Math.round(multiplier * lineBetMillis) / 1000;`
- Add JSDoc documenting the bet range constraint and per-line bet convention.
  - Before: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
  - After: `/**
 * Computes the payout for a single payline using legacy reel logic.
 * @param lineSymbols - Left-to-right symbols on the evaluated payline.
 * @param bet - Total bet in coins (1–100, integer). Per-line bet = bet / 10.
 * @returns Payout in coins, or 0 if no qualifying run.
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
