[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 3/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcpaytablets) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 3/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace explicit `any` with the already-exported `Bet` type on both public functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix HOUSE_EDGE direction — current code multiplies by 1.05 (increases payout); 95% RTP requires multiplying by 0.95
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object instead of a string literal for proper stack traces and instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES deeply readonly to prevent accidental mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ... same values
] as const satisfies ReadonlyArray<readonly number[]>;`
- Register and resolve factory/strategy/emitter through the DI container for testability
  - Before: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();`
  - After: `const factory = container.resolve<StandardReelBuilderFactory>("factory");
const strategy = container.resolve<DefaultStrategy>("strategy");
const emitter = container.resolve<SpinEventEmitter>("emitter");`

### `src/reels.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's rng.ts module to satisfy regulated gaming RNG requirements.
  - Before: `const r = Math.random() * total;`
  - After: `import { random } from './rng.js';
const r = random() * total;`
- Use Record<Symbol, number> to derive ReelWeightConfig from the Symbol union — exhaustiveness is then compiler-enforced.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module constants readonly and return readonly views from getter functions.
  - Before: `const SYMBOLS: Symbol[] = [...];
export function getReelSymbols(): Symbol[] {
  return SYMBOLS;
}`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
export function getReelSymbols(): readonly Symbol[] {
  return SYMBOLS;
}`
- Guard spinReel and getReelWeights against out-of-range reelIndex to fail fast.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length})`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Use satisfies for DEFAULT_WEIGHTS to preserve literal types while enforcing shape conformance.
  - Before: `const DEFAULT_WEIGHTS: ReelWeightConfig = {
  CHERRY: 25, LEMON: 25, ...
};`
  - After: `const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`

### `src/paytable.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Use readonly tuple type in PAY_TABLE to enforce immutability of payout values.
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = { ... };`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  // ...
} as const satisfies Record<string, readonly [number, number, number]>;`
- Replace the anonymous lineWins return type with a named Pick to align with the project's named-interface convention.
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export function lineWins(symbols: Symbol[]): Pick<LineWin, 'symbol' | 'count'> | null {`
- Add JSDoc to all three exported symbols, especially ANCIENT_RTP to clarify its purpose and regulatory status.
  - Before: `export const ANCIENT_RTP = 0.95;`
  - After: `/**
 * Return-to-player ratio for the legacy 'Ancient' slot variant.
 * @deprecated Use the active game config RTP instead.
 */
export const ANCIENT_RTP = 0.95;`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both exported functions to document parameter contracts and side-effects.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts every SCATTER symbol visible across all reels (entire 5×3 grid).
 * @param reels - Full reel window as a column-major readonly 2-D array.
 * @returns Total number of SCATTER symbols found.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Add JSDoc to `handleFreeSpins` documenting mutation side-effects.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Mutates `state` in-place to reflect free-spin transitions.
 * Triggers a 10-spin session on ≥3 scatters, adds 10 on retrigger,
 * and decrements remaining spins otherwise.
 * @param state - Mutable free-spin session record (modified in place).
 * @param scatters - Number of SCATTER symbols detected this spin.
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with a CSPRNG source acceptable to regulated gaming auditors.
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x100000000) * totalWeight;`
- Inject the random source to make the function deterministically testable.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = defaultSecureRandom,
): T {`
- Add readonly to parameters and guard against empty input.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');`
- Expand JSDoc with @param and @returns tags.
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Selects one item from `items` using weighted probability.
 * @param items - Candidate values; must be non-empty.
 * @param weights - Non-negative relative weights parallel to `items`.
 * @returns The selected item.
 * @throws {RangeError} When `items` is empty.
 */`

### `src/legacy.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Mark `lineSymbols` as readonly to prevent accidental mutation and signal immutable intent.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Use integer coin arithmetic to avoid floating-point imprecision in gambling monetary calculation.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// bet and return value in integer coins; divide only at display layer
const lineBetCoins = Math.trunc(bet / LINE_COUNT);
return multiplier * lineBetCoins;`
- Replace magic number 10 with a named constant that matches the documented ten-payline model.
  - Before: `const lineBet = bet / 10;`
  - After: `const LINE_COUNT = 10;
const lineBet = bet / LINE_COUNT;`
- Add JSDoc documenting the legacy wild-handling difference from the current engine formula.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Legacy payout calculation (pre-wild-escalation era).
 * Unlike `evaluateLine`, does NOT apply the `(1 + wildCount) × 2^wildCount` multiplier.
 * @param lineSymbols Exactly 5 symbols ordered left-to-right for a single payline.
 * @param bet Total bet in coins across all 10 lines.
 * @returns Coins won on this line, or 0 for no match.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
