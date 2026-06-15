[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `bet: any` with the already-exported `Bet` type on both public functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new RangeError(`Invalid bet: ${bet}. Must be an integer in [1, 100].`);`
- Enforce the upper bound of the bet range — replace warn-and-continue with a throw
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new RangeError(`Bet ${bet} exceeds maximum of 100.`);`
- Fix house edge direction to target 95% RTP — current code inflates payouts by 5% instead of applying a 5% house cut
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Mark PAYLINES as readonly to prevent mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<readonly number[]> = [`
- Inject dependencies into `spin` for testability (factory, strategy, emitter)
  - Before: `export function spin(bet: any): SpinResult {
  ...
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();`
  - After: `interface SpinDeps {
  factory?: StandardReelBuilderFactory;
  strategy?: DefaultStrategy;
  emitter?: SpinEventEmitter;
}
export function spin(bet: Bet, deps: SpinDeps = {}): SpinResult {
  const factory = deps.factory ?? new StandardReelBuilderFactory();
  const strategy = deps.strategy ?? new DefaultStrategy();
  const emitter = deps.emitter ?? new SpinEventEmitter();`
- Add JSDoc to the exported `spin` function
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `/**
 * Executes a single slot spin.
 * @param bet - Integer coin bet in the range [1, 100]
 * @returns SpinResult containing reels, line wins, scatter/jackpot flags, and total payout
 * @throws {RangeError} if bet is not an integer in [1, 100]
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 2.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Replace the direct Math.random() call with an injectable RNG parameter to enable deterministic testing and swap in a certified RNG for regulated play.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = Math.random): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Mark all module-level constants as deeply readonly to prevent accidental mutation.
  - Before: `const SYMBOLS: Symbol[] = ["CHERRY", ...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [ ... ];`
- Return a readonly view from getReelWeights to enforce the documented read-only invariant.
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);
  }
  return REEL_WEIGHTS[reelIndex];
}`
- Use Record<Symbol, number> for ReelWeightConfig to stay in sync with the Symbol union automatically.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Apply satisfies for DEFAULT_WEIGHTS to retain narrow literal types while still validating the shape at compile time.
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} as const satisfies ReelWeightConfig;`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports documenting the state-transition semantics
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Applies free-spin state transitions in place.
 * - Not active + ≥3 SCATTERs → activates, sets remaining = 10
 * - Active + ≥3 SCATTERs → retrigger, adds 10 to remaining
 * - Active + <3 SCATTERs → decrements remaining; deactivates at 0
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
- Add JSDoc to detectScatters clarifying the grid-wide (not payline-confined) count
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/** Counts SCATTER symbols across the entire grid (all columns, all rows — not payline-confined). */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with a CSPRNG-backed draw. For regulated gaming, use crypto.getRandomValues() to produce a uniform float.
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x1_0000_0000) * totalWeight;`
- Inject RNG as a parameter for deterministic testing.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  },
): T {`
- Add precondition guards for mismatched lengths and empty arrays, and mark parameters readonly.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');`
- Add @param and @returns JSDoc tags to document the contract of the public export.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 *
 * @param items - Non-empty array of candidate values.
 * @param weights - Parallel array of non-negative weights (must equal items.length).
 * @param rng - Optional RNG source; defaults to crypto.getRandomValues()-backed draw.
 * @returns A randomly selected item proportional to its weight.
 * @throws {RangeError} If items is empty or lengths differ.
 */`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark lineSymbols as readonly to prevent accidental mutation and communicate intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace floating-point division with integer arithmetic to satisfy regulated-gaming exactness. Compute the payout in integer coin units, then divide once at the final return.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// payout in integer tenths-of-coin to avoid IEEE 754 drift
return Math.round(multiplier * bet) / 10;`
- Add JSDoc to the exported function.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the legacy line payout for a resolved reel window row.
 * WILD symbols substitute for the first non-WILD symbol; SCATTER always returns 0.
 * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
 * @param bet - Total bet in coins (1–100, integer).
 * @returns Payout in coins, or 0 for no win.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
