[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 2.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcreelsts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7/10 | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Use the exported `Bet` type instead of `any` in both public function signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies readonly (readonly number[])[];`
- Remove unused container-resolved variables or wire them into the factory for testability
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");

const factory = new StandardReelBuilderFactory();
// rng and reelsModule never used`
  - After: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");

const factory = container.resolve<StandardReelBuilderFactory>("factory");
// factory receives rng/reelsModule via constructor injection`
- Remove the no-op listener or replace with a real handler; remove dead DEBUG_MODE branch
  - Before: `emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `emitter.emit(SPIN_DONE, finalResult);`

### `src/reels.ts` — 4/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace ReelWeightConfig with Record<Symbol, number> for automatic exhaustiveness enforcement.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants as readonly to prevent accidental mutation.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
const DEFAULT_WEIGHTS = { CHERRY: 25, ... } as const satisfies ReelWeightConfig;
const REEL_WEIGHTS: readonly (readonly number[])[] = [...]`
- Inject RNG from rng.ts to eliminate Math.random() and enable pure-function testing.
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
- Return readonly array from getReelWeights to prevent external mutation of live odds.
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  return REEL_WEIGHTS[reelIndex];
}`
- Add bounds guard to spinReel and getReelWeights to prevent silent undefined crashes.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length})`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/legacy.ts` — 7/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark lineSymbols parameter as readonly to prevent accidental mutation and signal read-only intent.
  - Before: `function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
- Eliminate float imprecision in gambling payouts by keeping arithmetic in integer coins and dividing last.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Stay in integer coins; divide at the final step
return Math.round(multiplier * bet / PAYLINE_COUNT);`
- Extract the payline divisor as a named constant to remove the magic number.
  - Before: `const lineBet = bet / 10;`
  - After: `const PAYLINE_COUNT = 10; // defined once, exported from types.ts
const lineBet = bet / PAYLINE_COUNT;`
- Add JSDoc to document parameters, return semantics, and the /PAYLINE_COUNT divisor.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes a single payline payout using legacy consecutive-match logic.
 * @param lineSymbols - Symbols on the evaluated payline, left-to-right.
 * @param bet - Total bet in integer coins (1–100). Line bet = bet / PAYLINE_COUNT.
 * @returns Payout in coins, or 0 for no match, SCATTER, or WILD-only lines.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace hardcoded `Math.random()` with an injected PRNG defaulting to `crypto.getRandomValues`, enabling both certifiable production use and deterministic tests.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  }
): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;`
- Add input validation guards for empty arrays, mismatched lengths, and zero/negative weights.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('items must not be empty');
  if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
  if (weights.some(w => w < 0)) throw new RangeError('weights must be non-negative');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) throw new RangeError('total weight must be > 0');`
- Add function-level JSDoc with @param, @returns, and @throws.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `/**
 * Selects one item from `items` proportionally to its weight.
 * @param items - Non-empty candidate array.
 * @param weights - Non-negative weights parallel to `items`; must sum > 0.
 * @param rng - Uniform [0, 1) random source; defaults to crypto.getRandomValues.
 * @returns The selected item.
 * @throws {RangeError} On empty array, length mismatch, negative weights, or zero total.
 */
export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
