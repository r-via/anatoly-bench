[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `any` on `bet` params with the existing `Bet` alias
  - Before: `export function spin(bet: any): SpinResult
export function computePayout(lineWins: LineWin[], bet: any): number`
  - After: `export function spin(bet: Bet): SpinResult
export function computePayout(lineWins: LineWin[], bet: Bet): number`
- Enforce the arbitrated 1..100 upper bound from README contract
  - Before: `if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
  throw "invalid bet";
}
if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (typeof bet !== "number" || !Number.isInteger(bet) || bet < 1 || bet > 100) {
  throw new Error(`bet must be an integer in [1, 100], got ${bet}`);
}`
- Make PAYLINES immutable with as const
  - Before: `const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  ...
];`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  ...
] as const satisfies readonly (readonly number[])[];`
- Remove the accumulating no-op emitter listener; expose emitter for real consumers
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);
// expose emitter via return or injection if external subscribers are needed`
- Add JSDoc to the primary public export `spin`
  - Before: `export function spin(bet: Bet): SpinResult {`
  - After: `/**
 * Runs one full spin: builds 5 reels, evaluates 10 paylines, applies wild
 * multipliers, detects scatters and jackpot, and returns the structured outcome.
 * @param bet Integer wager in [1, 100] coins.
 * @throws {Error} if bet is out of range or not an integer.
 */
export function spin(bet: Bet): SpinResult {`
- Inject factory, strategy, and emitter to improve testability
  - Before: `export function spin(bet: Bet): SpinResult {
  ...
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();`
  - After: `export function spin(
  bet: Bet,
  deps: SpinDeps = defaultDeps
): SpinResult {
  const { factory, strategy, emitter } = deps;`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's dedicated RNG module and inject it for testability
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use as const and readonly to lock down module-level constants
  - Before: `const SYMBOLS: Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };`
  - After: `const SYMBOLS = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const satisfies readonly Symbol[];
const DEFAULT_WEIGHTS = { ... } as const satisfies ReelWeightConfig;`
- Replace ReelWeightConfig interface with Record utility type for compile-time exhaustiveness
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Return a readonly copy from getReelWeights to prevent external mutation of live weight tables
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  const weights = REEL_WEIGHTS[reelIndex];
  if (!weights) throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  return weights;
}`
- Add bounds guard to spinReel to prevent undefined weights crash
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];
  if (!weights) throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both exported functions to document parameters, return values, and side effects.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across all reels and rows.
 * @param reels - Full grid snapshot (cols × rows).
 * @returns Total number of SCATTER symbols found.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Prefer a functional update pattern for handleFreeSpins to avoid in-place mutation — more composable and easier to test in isolation.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  } ...
}`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
  if (!state.active && scatters >= 3) {
    return { ...state, active: true, remaining: 10 };
  } else if (state.active && scatters >= 3) {
    return { ...state, remaining: state.remaining + 10 };
  } else if (state.active) {
    const remaining = state.remaining - 1;
    return { ...state, remaining, active: remaining > 0 };
  }
  return state;
}`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with a CSPRNG for regulated gaming compliance
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x1_0000_0000) * totalWeight;`
- Add a rng parameter for dependency injection and testability
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => { const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] / 0x1_0000_0000; }
): T {`
- Mark array parameters readonly and add input guards
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0 || items.length !== weights.length) throw new RangeError('items and weights must be non-empty and equal length');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight <= 0) throw new RangeError('weights must sum to a positive value');`
- Add @param and @returns JSDoc tags
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 * @param items - Non-empty array of candidates to pick from.
 * @param weights - Parallel positive-weight array; must match `items` length.
 * @returns The selected item.
 * @throws {RangeError} If arrays are empty, mismatched, or weights sum to zero.
 */`
