[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace explicit `any` with the already-defined Bet alias on both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix inverted house edge formula to deliver 95% RTP per arbitrated README spec
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw Error objects to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the documented 1–100 Bet upper bound by throwing instead of warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Lock PAYLINES as an immutable const with structural type check
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies readonly number[][];`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Replace ReelWeightConfig interface with Record<Symbol, number> for automatic exhaustiveness
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Apply readonly and as const to module-level constants
  - Before: `const SYMBOLS: Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `const SYMBOLS: readonly Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... } as const;
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];`
- Inject RNG dependency into pickFromWeighted to eliminate Math.random() and enable deterministic tests
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(
  items: readonly Symbol[],
  wts: readonly number[],
  rng: () => number,
): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Guard spinReel against out-of-bounds reelIndex
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length})`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Return readonly references from getters to protect internal state
  - Before: `export function getReelSymbols(): Symbol[] {
  return SYMBOLS;
}
export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelSymbols(): readonly Symbol[] {
  return SYMBOLS;
}
export function getReelWeights(reelIndex: number): readonly number[] {
  return REEL_WEIGHTS[reelIndex];
}`

### `src/legacy.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark lineSymbols readonly to prevent accidental mutation
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Eliminate intermediate float by deferring division — or use a Decimal library for exact regulated-gaming arithmetic
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Option A: defer division to a single operation (reduces but does not eliminate float error)
return (multiplier * bet) / 10;

// Option B (preferred for regulated RTP): integer coins throughout
// represent payout in deci-coins (×10), divide once at display layer`
- Guard bet range per README contract before any calculation
  - Before: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`bet must be integer 1–100, got ${bet}`);
  }`
- Add JSDoc for the only public export
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes legacy left-to-right payout for a single payline.
 * @param lineSymbols - Symbols on the payline; WILD substitutes for any non-SCATTER symbol.
 * @param bet - Total bet in coins (integer 1–100). Line bet is bet / 10.
 * @returns Payout in coins, or 0 when fewer than 3 consecutive matches are found.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Mark parameters readonly to express non-mutation intent
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Inject RNG as a parameter to enable certified PRNG in production and deterministic tests
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number,
): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;`
- Add input guards to prevent silent undefined/NaN corruption in gaming paths
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number): T {
  if (items.length === 0) throw new Error('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new Error('weightedPick: items/weights length mismatch');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) throw new Error('weightedPick: total weight must be positive');`
- Expand JSDoc with @param, @returns, and @throws tags
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Candidate items; must be non-empty and length-matched to weights.
 * @param weights - Positive weights parallel to items; must sum to a positive value.
 * @param rng - Uniform random source on [0, 1); must be a certified PRNG in production.
 * @returns The selected item.
 * @throws {Error} If arrays are empty, mismatched, or total weight is non-positive.
 */`
