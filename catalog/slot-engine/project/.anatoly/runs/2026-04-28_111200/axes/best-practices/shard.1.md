[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 6.5/10 | [details](#srclegacyts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcstrategyts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` with the already-declared `Bet` type alias on both public export signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix the house edge calculation to reduce payouts toward a ~95 % RTP instead of boosting them above 100 %
  - Before: `if (total > 0) {
  total = total * (1 + HOUSE_EDGE);
}
total += bet * 0.01;`
  - After: `if (total > 0) {
  total = total * (1 - HOUSE_EDGE);
}`
- Throw a proper Error object to preserve stack traces and allow instanceof checks in callers
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove the two unused container resolutions (`rng`, `reelsModule`) to eliminate no-unused-vars violations
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");`
- Mark PAYLINES deeply readonly and use satisfies to enforce payline shape at declaration
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ... rows ...
] satisfies ReadonlyArray<readonly [number, number, number, number, number]>;`
- Add JSDoc to `spin` documenting its parameter, return type, and thrown error
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `/**
 * Executes a single slot spin for the given bet amount.
 * @param bet - Integer coin bet in [1, 100]
 * @returns SpinResult with reels, line wins, scatter count, free spins awarded, and total payout
 * @throws {Error} When bet is not a positive integer
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 4.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's own rng.ts module to meet regulated-gaming RNG requirements and enable deterministic testing.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextFloat } from "./rng.js";

function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = nextFloat): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use Record<Symbol, number> instead of a manually-enumerated interface to keep ReelWeightConfig in sync with the Symbol union automatically.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants as readonly/as const to prevent accidental mutation of shared reel configuration state.
  - Before: `const SYMBOLS: Symbol[] = [ ... ];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `const SYMBOLS = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const satisfies readonly Symbol[];

const DEFAULT_WEIGHTS = { ... } satisfies Readonly<ReelWeightConfig>;

const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];`
- Add bounds validation in spinReel and getReelWeights to surface out-of-range reelIndex early instead of propagating undefined silently.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Return a defensive copy from getReelWeights to prevent external callers from mutating the shared internal reel configuration.
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range`);
  }
  return [...REEL_WEIGHTS[reelIndex]];
}`
- Add JSDoc to all three public exports to document valid input ranges and return semantics.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spins a single reel and returns the three visible symbols for that column.
 * @param reelIndex - Zero-based reel index in the range [0, 4].
 * @returns An array of exactly 3 symbols from top to bottom.
 * @throws {RangeError} If reelIndex is outside [0, 4].
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with an injectable rng parameter defaulting to crypto.getRandomValues-backed source, enabling both certification compliance and deterministic testing.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `const cryptoRng = (): number => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x1_0000_0000;
};

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = cryptoRng,
): T {
  if (items.length === 0) throw new RangeError('items must not be empty');
  if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;`
- Add readonly modifiers to parameters that are never mutated.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Add per-function JSDoc with @param and @returns tags for IDE consumers.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `/**
 * Selects a random element from `items` proportional to the corresponding `weights`.
 * @param items - The candidate items to pick from.
 * @param weights - Non-negative relative weights parallel to `items`.
 * @param rng - Optional uniform [0,1) random source; defaults to a CSPRNG.
 * @returns The selected item.
 */
export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng?: () => number): T {`

### `src/freespin.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports to document parameters, return values, and gambling-domain semantics
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  let count = 0;
  ...`
  - After: `/**
 * Counts every SCATTER symbol visible across the full 5×3 grid.
 * @param reels - Column-major 2-D array of all visible symbols.
 * @returns Total number of SCATTER symbols found.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {
  let count = 0;
  ...`
- Extract magic numbers into named constants for regulated-gaming auditability
  - Before: `state.remaining = 10;
    } else if (state.active && scatters >= 3) {
    state.remaining += 10;`
  - After: `const SCATTER_TRIGGER_COUNT = 3;
const FREE_SPINS_AWARD = 10;

// then in handleFreeSpins:
if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    state.remaining = FREE_SPINS_AWARD;
  } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    state.remaining += FREE_SPINS_AWARD;`
- Return a new FreeSpinState from handleFreeSpins instead of mutating in place to improve purity and testability
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } ...
}`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
  if (!state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    return { ...state, active: true, remaining: FREE_SPINS_AWARD };
  } else if (state.active && scatters >= SCATTER_TRIGGER_COUNT) {
    return { ...state, remaining: state.remaining + FREE_SPINS_AWARD };
  } else if (state.active) {
    const remaining = state.remaining - 1;
    return { ...state, remaining, active: remaining > 0 };
  }
  return state;
}`

### `src/legacy.ts` — 6.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (HIGH)

- Use integer arithmetic for monetary payout calculations to eliminate IEEE 754 rounding errors in regulated gambling code.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Caller provides `bet` in integer cents across all lines.
const lineBetCents = Math.floor(bet / LINE_COUNT);
return multiplier * lineBetCents; // result in integer cents`
- Add readonly modifier to the lineSymbols parameter to communicate immutability and prevent accidental mutation.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
- Add JSDoc to the exported function so callers understand parameter units, WILD behaviour, and the meaning of a 0 return.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the payout for a single payline using the legacy paytable.
 *
 * @param lineSymbols - Ordered symbols on the evaluated payline, left-to-right.
 *   A leading WILD is treated as the first non-WILD symbol for matching purposes.
 * @param bet - Total bet in the smallest monetary unit, spread across all lines.
 * @returns Payout amount in the same unit as `bet`, or 0 for a non-winning line.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace the magic number 10 with a named constant to make the payline assumption explicit and maintainable.
  - Before: `const lineBet = bet / 10;`
  - After: `const LINE_COUNT = 10 as const; // legacy fixed 10-payline configuration
const lineBet = bet / LINE_COUNT;`
- Accept getPayMultiplier as an injectable parameter with a default to enable pure unit tests without module mocking.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(
  lineSymbols: readonly Symbol[],
  bet: number,
  payMultiplierFn: typeof getPayMultiplier = getPayMultiplier,
): number {`

### `src/strategy.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to the abstract base class and its contract method so library consumers understand the extension point without consulting external docs.
  - Before: `export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
  - After: `/**
 * Extension point for post-calculation payout adjustment.
 * Subclass this to implement custom payout policies (e.g. capped maximums,
 * bonus-round multipliers). The active strategy is applied by `engine.ts`
 * as the final step of `spin()`.
 */
export abstract class SpinStrategy {
  /**
   * Returns a (possibly modified) copy of `result`.
   * Implementations MUST NOT mutate the input object.
   */
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
- Add JSDoc to the two concrete strategy classes so generated API docs and IDE hover text describe their behaviour without requiring callers to read the ADR.
  - Before: `export class DefaultStrategy extends SpinStrategy {
export class ConservativeStrategy extends SpinStrategy {`
  - After: `/** Pass-through strategy — returns the result unchanged. */
export class DefaultStrategy extends SpinStrategy {

/** Reduces {@link SpinResult.totalPayout} to 80 % of the computed value
 * using `Math.floor`, lowering effective RTP below the 95 % baseline.
 * See ADR-003 for rationale.
 */
export class ConservativeStrategy extends SpinStrategy {`
