[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9.25/10 | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `bet: any` with the already-exported `Bet` type.
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance to preserve stack traces and satisfy no-throw-literal.
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix house edge direction so payouts are reduced to target 95% RTP.
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Lock PAYLINES as a readonly const and validate row indices with satisfies.
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  // ...`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies readonly (readonly [0|1|2, 0|1|2, 0|1|2, 0|1|2, 0|1|2])[];`
- Accept injectable dependencies in spin() for testability.
  - Before: `export function spin(bet: any): SpinResult {
  // ...
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();`
  - After: `export interface SpinDeps {
  factory?: StandardReelBuilderFactory;
  strategy?: DefaultStrategy;
  emitter?: SpinEventEmitter;
}
export function spin(bet: Bet, deps: SpinDeps = {}): SpinResult {
  const factory = deps.factory ?? new StandardReelBuilderFactory();
  const strategy = deps.strategy ?? new DefaultStrategy();
  const emitter = deps.emitter ?? new SpinEventEmitter();`

### `src/reels.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace manual ReelWeightConfig interface with Record<Symbol, number> to automatically stay in sync with the Symbol union.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Add readonly to all module-level constants to prevent accidental mutation.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS: readonly Symbol[] = [...];
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = {...};
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...]`
- Use satisfies for DEFAULT_WEIGHTS to get both compile-time type checking and inferred literal types.
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`
- Inject an RNG function into pickFromWeighted to use src/rng.ts and enable deterministic testing.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Guard spinReel against out-of-bounds reelIndex to prevent undefined dereference crash.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length})`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/strategy.ts` — 9.25/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to all three exported classes, including the RTP-impact warning on `ConservativeStrategy`.
  - Before: `export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}

export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult { ... }
}`
  - After: `/**
 * Extension point for post-calculation payout adjustment.
 * Implement `adjustPayout` to modify a fully-computed `SpinResult`
 * before it is returned to the caller.
 */
export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}

/**
 * Reduces `totalPayout` to 80 % of the computed value.
 *
 * @remarks
 * Applying this strategy lowers the effective RTP below the 95 % target
 * documented in ADR-003. Ensure compliance review before deploying to
 * regulated markets.
 */
export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult { ... }
}`
- Consider a runtime RTP-floor guard inside `ConservativeStrategy` so accidental deep-chaining cannot push RTP below a legal minimum.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `const adjusted = Math.floor(result.totalPayout * 0.8);
// Enforce absolute floor required by jurisdiction (e.g. 70 % of bet)
const MIN_PAYOUT = Math.floor(result.totalPayout * 0.7);
totalPayout: Math.max(adjusted, MIN_PAYOUT),`

### `src/factories.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Make the return type immutable to prevent callers from mutating the generated grid
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][]`
  - After: `buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>`
- Add JSDoc to both exported classes so tooling and typedoc can surface design intent
  - Before: `export abstract class AbstractReelBuilderFactory {
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
}`
  - After: `/**
 * Contract for constructing the reel grid before payline evaluation.
 * Implement this to supply deterministic or seeded grids for replay/testing.
 */
export abstract class AbstractReelBuilderFactory {
  /**
   * @param reelCount Number of reels (columns) in the grid.
   * @param rowCount Number of visible rows per reel.
   */
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
}`
- Document the unused rowCount on the concrete override to prevent silent API confusion
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `/**
 * @param _rowCount Ignored — row height is fixed at 3 by spinReel.
 */
override buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`

### `src/freespin.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both exported functions, documenting parameters and side-effects
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts all SCATTER symbols visible across the full reel grid.
 * @param reels - The current 5×3 reel window (column-major).
 * @returns Total number of SCATTER symbols found.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Extract magic numbers as named module-level constants
  - Before: `state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;`
  - After: `const SCATTER_TRIGGER = 3;
const FREE_SPIN_AWARD = 10;

// ...
state.remaining = FREE_SPIN_AWARD;
  } else if (state.active && scatters >= SCATTER_TRIGGER) {
    state.remaining += FREE_SPIN_AWARD;`
- Return a new FreeSpinState instead of mutating the argument, making the transformation explicit and the function referentially safer
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } ...
}`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
  if (!state.active && scatters >= SCATTER_TRIGGER) {
    return { ...state, active: true, remaining: FREE_SPIN_AWARD };
  } else if (state.active && scatters >= SCATTER_TRIGGER) {
    return { ...state, remaining: state.remaining + FREE_SPIN_AWARD };
  } else if (state.active) {
    const remaining = state.remaining - 1;
    return { ...state, remaining, active: remaining > 0 };
  }
  return state;
}`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with crypto.getRandomValues() for certifiable gaming RNG.
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const array = new Uint32Array(1);
crypto.getRandomValues(array);
const roll = (array[0] / 0x100000000) * totalWeight;`
- Inject the random function to enable deterministic testing.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  randomFn: () => number = secureRandom,
): T {`
- Mark array parameters readonly to prevent accidental mutation assumptions.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Add input validation and complete JSDoc tags.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */
export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Non-empty array of items to pick from.
 * @param weights - Positive weights parallel to `items`.
 * @param randomFn - Uniform [0, 1) random source; defaults to `secureRandom`.
 * @returns The selected item.
 * @throws {RangeError} When `items` is empty or lengths mismatch.
 */
export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('items must not be empty');
  if (items.length !== weights.length) throw new RangeError('items and weights must have the same length');`
