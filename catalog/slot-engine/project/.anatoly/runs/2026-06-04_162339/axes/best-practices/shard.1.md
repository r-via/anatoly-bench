[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Use the already-defined `Bet` type instead of `any` on both public signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix inverted house-edge formula to target 95% RTP per arbitrated intent
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw Error objects and enforce the full 1..100 Bet range at one boundary
  - Before: `if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
  throw "invalid bet";
}
if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (typeof bet !== "number" || !Number.isInteger(bet) || bet < 1 || bet > 100) {
  throw new Error(`invalid bet: ${bet} (must be integer 1–100)`);
}`
- Make PAYLINES immutable and enforce valid row indices with satisfies
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  ...
] as const satisfies ReadonlyArray<ReadonlyArray<0 | 1 | 2>>;`
- Remove unused rng/reelsModule resolutions or wire them into the factory so the DI seam is functional
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: ...; getReelWeights: ... }>("reels");
const factory = new StandardReelBuilderFactory();`
  - After: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: ...; getReelWeights: ... }>("reels");
const factory = new StandardReelBuilderFactory(rng, reelsModule); // inject resolved deps`

### `src/reels.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace ReelWeightConfig interface with Record to eliminate manual sync with the Symbol union
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Inject an RNG function to satisfy regulated-gaming RNG requirements and enable deterministic testing
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextFloat } from "./rng.js";

function pickFromWeighted(
  items: readonly Symbol[],
  wts: readonly number[],
  rng: () => number = nextFloat,
): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add reelIndex bounds guard in spinReel to prevent silent TypeError
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Return readonly arrays from public getters to prevent caller mutation of module state
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
- Apply as const and satisfies for immutable module constants
  - Before: `const SYMBOLS: Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
];

const DEFAULT_WEIGHTS: ReelWeightConfig = {`
  - After: `const SYMBOLS = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const satisfies readonly Symbol[];

const DEFAULT_WEIGHTS = {`

### `src/paytable.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Type PAY_TABLE key with the imported Symbol union and freeze entries with `as const` / readonly tuples
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = { ... };`
  - After: `const PAY_TABLE: Readonly<Record<Symbol, readonly [number, number, number]>> = { ... } satisfies Readonly<Record<Symbol, readonly [number, number, number]>>;`
- Mark `symbols` parameter as readonly since `lineWins` never mutates it
  - Before: `export function lineWins(symbols: Symbol[]): ...`
  - After: `export function lineWins(symbols: readonly Symbol[]): ...`
- Add JSDoc to all three public exports
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number { ... }

export function lineWins(symbols: Symbol[]): ...`
  - After: `/** Theoretical RTP for the legacy paytable variant (95%). */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the base pay multiplier for `symbol` matched `count` times (3–5).
 * Returns 0 for WILD, SCATTER, or any unrecognised symbol.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number { ... }

/**
 * Evaluates a single payline of symbols, returning the matching pay-symbol
 * and contiguous run length, or null if no 3+-symbol win is present.
 */
export function lineWins(symbols: readonly Symbol[]): ...`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace hardcoded Math.random() with an injectable rng parameter to enable certifiable PRNG substitution and deterministic tests.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const roll = rng() * totalWeight;`
- Add input guards to prevent silent undefined returns on empty arrays.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = Math.random): T {
  if (items.length === 0) throw new RangeError('weightedPick: items array must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');`
- Expand JSDoc with @param and @returns tags.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Candidate items to pick from.
 * @param weights - Parallel non-negative weights; must match items.length.
 * @param rng - Optional RNG source; defaults to Math.random. Inject a seeded PRNG for certified gaming use.
 * @returns The selected item.
 * @throws {RangeError} If items is empty or arrays differ in length.
 */`

### `src/jackpot.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Extract the magic number threshold as a named `as const` export so it appears in diffs and is reusable in tests.
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  let diamondCount = 0;
  ...
  return diamondCount >= 4;
}`
  - After: `const JACKPOT_THRESHOLD = 4 as const;

export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  let diamondCount = 0;
  ...
  return diamondCount >= JACKPOT_THRESHOLD;
}`
- Add JSDoc to document the DIAMOND-count contract and grid assumption for API consumers.
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Returns `true` when the reels contain 4 or more DIAMOND symbols anywhere
 * across the full 5 × 3 grid in a single spin.
 *
 * @param reels - Column-major 5 × 3 symbol grid from a completed spin.
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (HIGH)

- ReadonlyArray for unmodified parameter
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Add JSDoc to the public export
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the legacy payout for a single payline.
 * @param lineSymbols - Left-to-right symbols on the line (3–5 elements).
 * @param bet - Total bet in coins (integer 1–100). Per-line stake is bet/10.
 * @returns Payout in coins (0 when no winning run of ≥3 is found).
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Use integer arithmetic to avoid IEEE 754 imprecision on monetary payouts
  - Before: `const multiplier = getPayMultiplier(first, matchCount);
const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const multiplier = getPayMultiplier(first, matchCount);
// Avoid floating-point: keep in tenths-of-coin, return exact integer coins.
return Math.round(multiplier * bet) / 10;`
- Guard against empty / short lineSymbols arrays
  - Before: `const first = lineSymbols[0] === "WILD"`
  - After: `if (lineSymbols.length === 0) return 0;
const first = lineSymbols[0] === "WILD"`
