[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |

## 🔍 Details

### `src/reels.ts` — 4.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Replace ReelWeightConfig interface with Record<Symbol, number> to stay in sync with the Symbol union automatically.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Freeze module-level constants with readonly/as const to prevent runtime mutation.
  - Before: `const SYMBOLS: Symbol[] = ["CHERRY", ...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };
const REEL_WEIGHTS: number[][] = [...];`
  - After: `const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { CHERRY: 25, ... } as const;
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];`
- Return ReadonlyArray<number> from getReelWeights to enforce the documented read-only contract.
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  return REEL_WEIGHTS[reelIndex];
}`
- Inject an RNG function to enable deterministic testing and wire in the project's src/rng.ts certified implementation.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const r = Math.random() * total;
  ...
}
export function spinReel(reelIndex: number): Symbol[] {`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
  const r = rng() * total;
  ...
}
export function spinReel(reelIndex: number, rng: () => number): Symbol[] {`
- Add a bounds guard to spinReel to fail fast on invalid reelIndex instead of propagating undefined.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/paytable.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Make PAY_TABLE immutable and use `satisfies` for precise key checking
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  // ...
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Record<string, readonly [number, number, number]>;`
- Add @deprecated to ANCIENT_RTP and JSDoc to all public exports
  - Before: `export const ANCIENT_RTP = 0.95;`
  - After: `/**
 * @deprecated Use the RTP constant from engine config instead.
 * Theoretical return-to-player: 95%.
 */
export const ANCIENT_RTP = 0.95;`
- Add JSDoc to getPayMultiplier
  - Before: `export function getPayMultiplier(symbol: Symbol, count: number): number {`
  - After: `/**
 * Returns the base payout multiplier for a (symbol, run-length) pair.
 * Returns 0 for WILD, SCATTER, or run lengths outside [3, 5].
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Accept a CSPRNG provider instead of calling Math.random() directly — required for regulated gaming compliance.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000
): T {
  const roll = random() * totalWeight;`
- Add parameter readonly and defensive input guards.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');
  if (weights.some(w => w < 0)) throw new RangeError('weightedPick: weights must be non-negative');`
- Add @param and @returns JSDoc tags to the public export.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Selects one item from `items` using weighted random sampling.
 * @param items - Candidate items to pick from (non-empty).
 * @param weights - Non-negative weight per item; higher weight = higher probability.
 * @returns The selected item.
 * @throws {RangeError} If arrays are empty, mismatched, or contain negative weights.
 */`
