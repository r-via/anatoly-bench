[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 5.5/10 | [details](#srcrngts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcstrategyts) |

## 🔍 Details

### `src/engine.ts` — 5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)

- Replace `any` with the already-defined `Bet` type on both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance instead of a raw string
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES fully immutable with `as const`
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ... same values
] as const satisfies ReadonlyArray<readonly number[]>;`
- Remove the no-op event listener registration (or remove the emitter entirely if unused)
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Add JSDoc to the primary public export `spin`
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `/**
 * Runs one full spin: spins five reels, evaluates ten paylines, applies wild multipliers,
 * detects scatter bonuses and the progressive jackpot.
 * @param bet - Integer coin bet in the range 1..100.
 * @returns Structured outcome including total coin payout.
 */
export function spin(bet: Bet): SpinResult {`

### `src/paytable.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Make PAY_TABLE fully immutable using as const satisfies, narrowing tuple literals while retaining type safety
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  ...
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  ...
} as const satisfies Record<string, readonly [number, number, number]>;`
- Add JSDoc to all three public exports; document the opaque ANCIENT_RTP name
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {
export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `/** Base return-to-player ratio used by the classic ("ancient") cabinet configuration. */
export const ANCIENT_RTP = 0.95;

/** Returns the payout multiplier for `symbol` appearing `count` times on a payline, or 0 if ineligible. */
export function getPayMultiplier(symbol: Symbol, count: number): number {

/** Evaluates a single payline and returns the winning symbol and count, or null if no win. */
export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
- Rename lineWins to evaluateLine or computeLineWin to avoid name collision with SpinResult.lineWins
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function evaluateLine(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`

### `src/reels.ts` — 5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Inject an RNG function to make `spinReel` deterministic and testable, and use the project's `src/rng.ts` instead of `Math.random()`.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = Math.random): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Replace the bespoke `ReelWeightConfig` interface with `Record<Symbol, number>` to stay DRY with the `Symbol` union.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants as `readonly` / `as const` and return a copy from `getReelWeights` to prevent external mutation.
  - Before: `const REEL_WEIGHTS: number[][] = [ ... ];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [ ... ];

export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  return REEL_WEIGHTS[reelIndex];
}`
- Add JSDoc to all three exported functions.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spins a single reel column and returns 3 symbols sampled from the weighted distribution.
 * @param reelIndex - Zero-based index of the reel (0–4).
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/rng.ts` — 5.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Inject the random source so the function is testable and swappable for a certified CSPRNG
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random
): T {
  if (items.length === 0) throw new Error('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new Error('weightedPick: items/weights length mismatch');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;`
- Use `readonly` on both array parameters to signal non-mutation and enable stricter callers
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Replace Math.random() with a certified CSPRNG for regulated gaming (e.g. crypto.getRandomValues-based uniform draw)
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `// Use a certified CSPRNG supplier injected via the `rng` parameter above.
// Example: import { secureRandom } from './crypto-rng'; and pass it at call site.`

### `src/strategy.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to all three public exports
  - Before: `export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
  - After: `/** Base strategy for post-spin payout adjustment. Extend to implement custom payout policies. */
export abstract class SpinStrategy {
  /** Adjusts the payout of a completed spin result. */
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
- Use integer arithmetic for payout scaling in regulated gaming context
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor((result.totalPayout * 8) / 10),`
