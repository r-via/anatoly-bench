[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 2.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 13: Security (HIGH)

- Replace any with Bet on both public signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix the inverted house-edge formula to produce 95% RTP per arbitrated contract
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 → ~105% RTP on wins`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 → ~95% RTP`
- Reject bets above 100 instead of warning — enforces the arbitrated 1..100 Bet range
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum of 100");`
- Remove unused rng and reelsModule resolves or thread rng into factory
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `// Pass rng to factory so the certified RNG drives reel outcomes:
const rng = container.resolve<typeof weightedPick>("rng");
const reels = factory.buildReels(5, 3, rng);`
- Remove the no-op listener that leaks on every spin
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Mark PAYLINES as readonly to prevent accidental mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly number[][] = [`

### `src/reels.ts` — 2.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Route all randomness through rng.ts to meet regulated gaming RNG compliance.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], random: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = random() * total;`
- Add bounds guard to spinReel and getReelWeights to prevent silent undefined array access.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Use Record<Symbol, number> to keep ReelWeightConfig in sync with the Symbol union.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark constants readonly and return copies from accessors to prevent external mutation.
  - Before: `const SYMBOLS: Symbol[] = [...];

export function getReelSymbols(): Symbol[] {
  return SYMBOLS;
}`
  - After: `const SYMBOLS: readonly Symbol[] = [...];

export function getReelSymbols(): readonly Symbol[] {
  return SYMBOLS;
}`
- Use satisfies to validate DEFAULT_WEIGHTS at declaration without widening the type.
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/strategy.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Extract the magic multiplier as a named typed constant and mark the parameter readonly
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return {
      ...result,
      totalPayout: Math.floor(result.totalPayout * 0.8),
    };
  }
}`
  - After: `/** Certified RTP for this strategy: 76 % (base 95 % × MULTIPLIER). */
export class ConservativeStrategy extends SpinStrategy {
  private static readonly PAYOUT_MULTIPLIER = 0.8 as const;

  adjustPayout(result: Readonly<SpinResult>): SpinResult {
    return {
      ...result,
      totalPayout: Math.floor(result.totalPayout * ConservativeStrategy.PAYOUT_MULTIPLIER),
    };
  }
}`
- Add JSDoc to the abstract base class and its concrete implementations
  - Before: `export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
  - After: `/**
 * Base strategy for post-calculation payout adjustment.
 * All implementations must be deterministic and produce a certified RTP.
 */
export abstract class SpinStrategy {
  /**
   * Adjusts the raw payout from the spin engine.
   * @param result - Immutable result produced by the spin engine.
   * @returns A new SpinResult with the adjusted totalPayout.
   */
  abstract adjustPayout(result: Readonly<SpinResult>): SpinResult;
}`

### `src/factories.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Return ReadonlyArray to match the arbitrated SpinResult contract and prevent accidental mutation downstream.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
buildReels(reelCount: number, _rowCount: number): Symbol[][]`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>`
- Inject the reel-spinning dependency so the factory can be tested without module mocking.
  - Before: `import { spinReel } from "./reels.js";

export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  constructor(private readonly spin: (index: number) => ReadonlyArray<Symbol>) {}

  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Add JSDoc to both exported classes.
  - Before: `export abstract class AbstractReelBuilderFactory {`
  - After: `/**
 * Base factory for constructing reel grids. Extend to provide custom reel-spinning strategies.
 */
export abstract class AbstractReelBuilderFactory {`

### `src/freespin.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Extract magic game-rule constants to named, auditable values
  - Before: `if (!state.active && scatters >= 3) {
  state.active = true;
  state.remaining = 10;
} else if (state.active && scatters >= 3) {
  state.remaining += 10;
}`
  - After: `const SCATTER_THRESHOLD = 3;
const FREE_SPIN_AWARD = 10;

if (!state.active && scatters >= SCATTER_THRESHOLD) {
  state.active = true;
  state.remaining = FREE_SPIN_AWARD;
} else if (state.active && scatters >= SCATTER_THRESHOLD) {
  state.remaining += FREE_SPIN_AWARD;
}`
- Add JSDoc to both public exports
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across all reel columns.
 * @param reels - 2-D grid of symbols (columns × rows).
 * @returns Total number of SCATTER symbols visible.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Consider an immutable state-transition signature instead of in-place mutation
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Inject the RNG as a parameter to satisfy regulatory requirements (certifiable RNG source) and enable deterministic unit tests.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number
): T {
  const roll = rng() * totalWeight;`
- Add input guards to prevent silent undefined return and distribution corruption.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items/weights length mismatch');
  if (weights.some(w => w < 0)) throw new RangeError('weightedPick: weights must be non-negative');`
- Expand JSDoc with @param, @returns, and @throws tags.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Selects a random element from items using cumulative-weight sampling.
 * @param items - Non-empty candidate array.
 * @param weights - Non-negative weights parallel to items.
 * @param rng - Certified uniform random source in [0, 1).
 * @returns The selected item.
 * @throws {RangeError} If arrays are empty, mismatched in length, or contain negative weights.
 */`

### `src/legacy.ts` — 7.5/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark lineSymbols as readonly to prevent accidental mutation and signal read-only intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Use integer arithmetic for gambling payouts to avoid IEEE 754 drift. Compute in integer coin-units and divide only at display time, or use Math.round as a minimal guard.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const LINE_COUNT = 10;
// Compute in integer hundredths to avoid floating-point drift
const payoutCoins = Math.round(multiplier * bet) / LINE_COUNT;
return payoutCoins;`
- Replace the magic number 10 with a named constant to make the line-count assumption explicit.
  - Before: `const lineBet = bet / 10;`
  - After: `const LINE_COUNT = 10 as const;
const lineBet = bet / LINE_COUNT;`
- Add JSDoc documenting WILD substitution logic, SCATTER early-return, and the line-bet divisor assumption.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the payout for a single payline using legacy left-to-right consecutive matching.
 * WILDs substitute for any non-SCATTER symbol. SCATTER wins are excluded (handled separately).
 * @param lineSymbols - Ordered symbols on the payline (left to right).
 * @param bet - Total bet in coins (1–100, integer). lineBet = bet / LINE_COUNT.
 * @returns Payout in coins, or 0 if fewer than 3 consecutive matches.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
