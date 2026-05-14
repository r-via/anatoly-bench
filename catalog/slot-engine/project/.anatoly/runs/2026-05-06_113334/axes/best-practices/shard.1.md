[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcpaytablets) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `any` with the already-defined `Bet` type on both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object to carry a stack trace and satisfy `no-throw-literal`
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Inject the certifiable RNG into the factory to restore the regulated-gambling compliance guarantee
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
// rng never used...
const factory = new StandardReelBuilderFactory();
const reels = factory.buildReels(5, 3);`
  - After: `const rng = container.resolve<typeof weightedPick>("rng");
const factory = new StandardReelBuilderFactory(rng);
const reels = factory.buildReels(5, 3);`
- Mark PAYLINES as deeply readonly using `as const` to prevent mutation
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  ...
] as const satisfies readonly (readonly number[])[];`
- Remove the dead no-op event listener before the emit call
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`
- Add JSDoc to the `spin` public export to match `computePayout`
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `/**
 * Executes one complete slot spin.
 * @param bet - Integer coin wager in the range [1, 100].
 * @returns A fully-populated SpinResult including payout, line wins, and bonus state.
 * @throws {Error} When `bet` is not a positive integer.
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's dedicated rng.ts module and inject it as a parameter for testability
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextFloat } from './rng.js'; // certified RNG
function pickFromWeighted(
  items: Symbol[],
  wts: number[],
  rng: () => number = nextFloat,
): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use Record<Symbol, number> instead of manually enumerating all keys in ReelWeightConfig
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Add readonly modifiers to all module-level constants to prevent accidental mutation
  - Before: `const SYMBOLS: Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `const SYMBOLS: readonly Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];`
- Use the `satisfies` operator on DEFAULT_WEIGHTS for type-safe literal inference (TS 5.5+)
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`
- Add JSDoc to all exported functions documenting parameter constraints
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spins a single reel and returns 3 visible symbols.
 * @param reelIndex - Zero-based reel index (0–4)
 * @returns Ordered array of 3 symbols for the visible rows
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/paytable.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Use `Partial<Record<Symbol, readonly [number, number, number]>>` for a more precise and immutable PAY_TABLE type
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  ...
};`
  - After: `const PAY_TABLE: Partial<Record<Symbol, readonly [number, number, number]>> = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  ...
};`
- Apply the `satisfies` operator to PAY_TABLE to validate the shape while preserving literal types
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  ...
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25] as const,
  LEMON:   [2,   5,   25] as const,
  BELL:    [5,   20,  100] as const,
  BAR:     [10,  40,  200] as const,
  SEVEN:   [25,  100, 500] as const,
  DIAMOND: [50,  250, 1000] as const,
} satisfies Partial<Record<Symbol, readonly [number, number, number]>>;`
- Add JSDoc to all three public exports
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {
export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `/** Base return-to-player ratio for the Ancient theme (95%). */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the base pay multiplier for a matching symbol run.
 * @param symbol - The matched reel symbol (must not be WILD or SCATTER).
 * @param count - Number of consecutive matches from the left (3, 4, or 5).
 * @returns The multiplier to apply to the line bet, or 0 for no qualifying match.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {

/**
 * Evaluates a single payline's symbol sequence and returns the win result.
 * @param symbols - Ordered reel symbols along the payline (left to right).
 * @returns Matched symbol and count if a qualifying run of 3+ is found, or null.
 */
export function lineWins(symbols: Symbol[]): Pick<LineWin, 'symbol' | 'count'> | null {`
- Replace the anonymous return type of lineWins with Pick<LineWin, 'symbol' | 'count'> to reuse the documented interface
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: Symbol[]): Pick<LineWin, 'symbol' | 'count'> | null {`

### `src/freespin.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both exported functions to satisfy rule 9 and align with the API reference documentation.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts every SCATTER symbol visible across the full reel grid.
 * @param reels - The fully visible reel columns (5×3 grid).
 * @returns Total number of SCATTER symbols found.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Make handleFreeSpins a pure function (rule 5 + rule 15): accept Readonly<FreeSpinState> and return a new state rather than mutating in-place.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;
  } else if (state.active) {
    state.remaining--;
    if (state.remaining <= 0) {
      state.active = false;
    }
  }
}`
  - After: `export function handleFreeSpins(
  state: Readonly<FreeSpinState>,
  scatters: number,
): FreeSpinState {
  if (!state.active && scatters >= 3) {
    return { ...state, active: true, remaining: 10 };
  }
  if (state.active && scatters >= 3) {
    return { ...state, remaining: state.remaining + 10 };
  }
  if (state.active) {
    const remaining = state.remaining - 1;
    return { ...state, remaining, active: remaining > 0 };
  }
  return state;
}`
- Add input validation on `scatters` for regulated-gaming robustness (rule 17).
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
  if (!Number.isInteger(scatters) || scatters < 0) throw new RangeError(`scatters must be a non-negative integer, got ${scatters}`);`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark lineSymbols as readonly to make the non-mutation contract explicit and prevent accidental in-place modification by future callers.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc to document the public export contract, including WILD promotion, the minimum match threshold, and the line-bet formula.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the coin payout for a single payline using the legacy evaluation algorithm.
 *
 * WILD symbols act as substitutes: the leading symbol is determined by the first
 * non-WILD in the line. A line composed entirely of WILDs returns 0.
 * SCATTER symbols are not evaluated for line wins and also return 0.
 * A minimum of 3 consecutive matching symbols (left-to-right) is required.
 *
 * @param lineSymbols - Ordered symbols on the payline, left to right.
 * @param bet - Total coin bet for the spin; line bet is derived as bet / 10.
 * @returns Coin payout for this payline; 0 when no qualifying combination is found.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace floating-point monetary arithmetic with integer arithmetic to avoid IEEE 754 precision errors in regulated gambling payouts. Work in integer coin-tenths and convert only at the final output boundary.
  - Before: `const multiplier = getPayMultiplier(first, matchCount);
const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const multiplier = getPayMultiplier(first, matchCount);
// Avoid floating-point: compute in integer tenths-of-a-coin, round to nearest unit
const payoutTenths = Math.round(multiplier * bet);
return payoutTenths / 10;`

### `src/rng.ts` — 3.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use a injectable RNG parameter instead of hard-coding Math.random(), enabling deterministic tests and certifiable-RNG substitution in production.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const roll = rng() * totalWeight;`
- Add input validation guards to fail loudly on empty arrays, mismatched lengths, non-positive weights, and zero total weight.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = Math.random): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
  if (weights.some(w => w < 0)) throw new RangeError('weightedPick: weights must be non-negative');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) throw new RangeError('weightedPick: total weight must be positive');`
- Replace Math.random() with a certifiable CSPRNG for regulated gaming use (e.g. crypto.getRandomValues).
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `// Inject a certified RNG; example using Web Crypto as a uniform [0,1) draw:
function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / (0xFFFFFFFF + 1);
}
// Pass cryptoRandom as the rng argument in production.`
- Add full @param and @returns JSDoc tags to the exported function.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Selects one item from `items` with probability proportional to its corresponding weight.
 *
 * @param items - Non-empty array of candidate values.
 * @param weights - Parallel array of non-negative weights; must have the same length as `items`.
 * @param rng - Optional uniform random source in [0, 1). Defaults to `Math.random`.
 * @returns The selected item.
 * @throws {RangeError} If `items` is empty, lengths differ, any weight is negative, or total weight is zero.
 */`
