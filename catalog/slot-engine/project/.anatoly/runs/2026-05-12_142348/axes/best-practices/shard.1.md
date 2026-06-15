[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 6/10 | [details](#srcenginets) |
| `src/reels.ts` | 🔴 CRITICAL | 3.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcstrategyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8.75/10 | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 6/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `bet: any` with the already-declared `Bet` alias in both exported functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove the two unused container resolutions in spin()
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");`
- Make PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  ...
] as const;`
- Use integer coin arithmetic throughout payout calculations to avoid floating-point drift in regulated gambling context
  - Before: `const lineBet = bet / 10;
// floating-point multiplications accumulate
return Math.ceil(total);`
  - After: `// Work in integer coin units; divide only at the display layer
const lineBetCoins = Math.floor(bet / 10);
// ... integer arithmetic throughout ...
return total; // already integer`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's dedicated RNG module to satisfy gaming-compliance requirements.
  - Before: `const r = Math.random() * total;`
  - After: `import { randomFloat } from "./rng.js";
// inside pickFromWeighted:
const r = randomFloat() * total;`
- Use Record<Symbol, number> to keep weight config in sync with the Symbol union automatically.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants as readonly to prevent accidental mutation.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
const REEL_WEIGHTS: number[][] = [...];`
  - After: `const SYMBOLS: readonly Symbol[] = [...];
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = {...};
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];`
- Use satisfies on DEFAULT_WEIGHTS to validate shape at compile time while retaining literal types.
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`
- Narrow reelIndex to the valid union type to catch out-of-range calls at compile time.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `export function spinReel(reelIndex: 0 | 1 | 2 | 3 | 4): Symbol[] {`

### `src/paytable.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Make PAY_TABLE deeply immutable, key-narrowed to the Symbol union, and inferred via satisfies + as const.
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  ...
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Record<Symbol, readonly [number, number, number]>;`
- Add JSDoc to all three public exports; ANCIENT_RTP especially needs context for its name and purpose.
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {

export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `/** RTP (Return to Player) for the legacy paytable — 95%. Retained for historical audit trails. */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the payout multiplier for `symbol` matched `count` times consecutively (3–5).
 * Returns 0 for unsupported symbols or counts outside [3, 5].
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {

/**
 * Evaluates a single payline's symbol sequence left-to-right.
 * Returns the winning symbol and run length, or null if fewer than 3 consecutive symbols match.
 */
export function lineWins(symbols: Symbol[]): LineMatch | null {`
- Extract the inline return type of lineWins into a named intermediate type for consistency with the project's interface conventions.
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `type LineMatch = { readonly symbol: Symbol; readonly count: number };
export function lineWins(symbols: Symbol[]): LineMatch | null {`

### `src/strategy.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to all three exported classes to support library consumers and generated API docs.
  - Before: `export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
  - After: `/**
 * Base class for post-computation payout adjustment strategies.
 * Subclass and override {@link adjustPayout} to implement custom RTP policies.
 */
export abstract class SpinStrategy {
  /** Returns a (possibly modified) copy of `result` with adjusted payout fields. */
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
- Extract the `0.8` RTP factor in `ConservativeStrategy` to a named readonly constant for auditability in regulated gaming environments.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `private static readonly PAYOUT_FACTOR = 0.8 as const;
// ...
totalPayout: Math.floor(result.totalPayout * ConservativeStrategy.PAYOUT_FACTOR),`

### `src/freespin.ts` — 8.75/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports, documenting the trigger threshold and award count
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across the full reel grid.
 * @param reels - Full 5×3 grid of symbols
 * @returns Total number of SCATTER symbols visible
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Extract magic numbers to named constants for regulatory auditability
  - Before: `if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;`
  - After: `const SCATTER_TRIGGER = 3;
const FREE_SPIN_AWARD = 10;

// …
if (!state.active && scatters >= SCATTER_TRIGGER) {
    state.active = true;
    state.remaining = FREE_SPIN_AWARD;
  } else if (state.active && scatters >= SCATTER_TRIGGER) {
    state.remaining += FREE_SPIN_AWARD;`
- Return a new FreeSpinState instead of mutating in place to satisfy immutability and testability
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;
  } else if (state.active) {
    state.remaining--;
    if (state.remaining <= 0) state.active = false;
  }
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

### `src/factories.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both exported symbols so API consumers and generated docs capture the contract.
  - Before: `export abstract class AbstractReelBuilderFactory {
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
}`
  - After: `/**
 * Base factory for constructing the symbol grid before payline evaluation.
 * Subclass to provide deterministic, seeded, or certified-RNG grids.
 */
export abstract class AbstractReelBuilderFactory {
  /**
   * @param reelCount - Number of vertical reel strips to produce.
   * @param rowCount  - Visible row height (implementations may fix this internally).
   * @returns A `reelCount × rowCount` grid of symbols.
   */
  abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
}`
- Strengthen return-type immutability to prevent downstream mutation of the generated grid.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): readonly (readonly Symbol[])[] {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Inject the random source so the function is deterministic in tests and can accept a CSPRNG in production.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random   // swap for CSPRNG in production
): T {
  const roll = rng() * totalWeight;`
- Mark array parameters readonly to communicate the pure-function contract.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Guard against empty input and length mismatch to avoid silent undefined returns.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');`
