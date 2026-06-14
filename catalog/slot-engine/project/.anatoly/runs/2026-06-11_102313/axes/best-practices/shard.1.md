[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 5.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 5.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` with the `Bet` alias already defined in this file
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix house-edge direction: multiply by (1 − HOUSE_EDGE) to produce 95% RTP, not 105%
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error instance to preserve stack traces and support instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ... rows ...
] as const satisfies readonly (readonly number[])[];`
- Remove unused DI resolutions or wire factory/strategy/emitter through the container
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
// rng never called below
const reelsModule = container.resolve<...>("reels");
// reelsModule never called below
const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();`
  - After: `container.register("factory", new StandardReelBuilderFactory());
container.register("strategy", new DefaultStrategy());
container.register("emitter", new SpinEventEmitter());
// then in spin():
const factory = container.resolve<StandardReelBuilderFactory>("factory");
const strategy = container.resolve<DefaultStrategy>("strategy");
const emitter = container.resolve<SpinEventEmitter>("emitter");`

### `src/reels.ts` — 4/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace manual ReelWeightConfig interface with Record utility type keyed on the Symbol union
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants readonly and return defensive copies from exported accessors
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
const REEL_WEIGHTS: number[][] = [...];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}
export function getReelSymbols(): Symbol[] {
  return SYMBOLS;
}`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
const DEFAULT_WEIGHTS = {...} satisfies ReelWeightConfig;
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];

export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  return REEL_WEIGHTS[reelIndex];
}
export function getReelSymbols(): ReadonlyArray<Symbol> {
  return SYMBOLS;
}`
- Inject an RNG function to enable deterministic testing and route through the certified src/rng.ts module
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Add reelIndex bounds guard to spinReel
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Precompute weight totals to avoid recalculating on every pickFromWeighted call
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);`
  - After: `const REEL_TOTALS: readonly number[] = REEL_WEIGHTS.map(w => w.reduce((s, v) => s + v, 0));

function pickFromWeighted(items: Symbol[], wts: number[], total: number): Symbol {`

### `src/strategy.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 17: Context-adapted rules (MEDIUM)

- Add JSDoc to all public exports, especially documenting the RTP impact of ConservativeStrategy
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {`
  - After: `/**
 * Reduces all payouts by 20%. NOTE: this strategy is NOT calibrated to the
 * certified 95% RTP and must only be used in non-regulated/demo contexts.
 */
export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {`
- Align ConservativeStrategy's reduction factor to preserve the 95% RTP, or rename/guard it clearly
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `// If a lower-volatility profile is needed, calibrate against the paytable
// so long-run RTP still converges to 95%.
totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_FACTOR), // CONSERVATIVE_FACTOR must be RTP-verified`

### `src/factories.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Align return type with the README SpinResult.reels contract and enforce immutability at the factory boundary.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];

  buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;

  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Add JSDoc to both exported classes to document the factory contract.
  - Before: `export abstract class AbstractReelBuilderFactory {
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];`
  - After: `/** Abstract factory for constructing the reel grid. Extend to provide custom reel-spin strategies. */
export abstract class AbstractReelBuilderFactory {
  /** Build a reelCount×rowCount symbol grid. */
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;`
- Inject the spin function to decouple StandardReelBuilderFactory from reels.ts and allow unit-test mocking.
  - Before: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  constructor(private readonly spin: (reelIndex: number) => Symbol[] = spinReel) { super(); }

  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with a CSPRNG-backed draw to satisfy regulated gaming certification requirements (GLI-11 / UKGC).
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const roll = (crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000) * totalWeight;`
- Inject the RNG function to enable deterministic testing.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: T[], weights: number[], rng: () => number = Math.random): T {`
- Add readonly to parameters and guard against empty/mismatched input.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');`

### `src/legacy.ts` — 7/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark lineSymbols as readonly to prevent accidental mutation and signal read-only intent to callers.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace index-based for loop with for...of to eliminate redundant double-indexing and match modern TypeScript style.
  - Before: `for (let i = 0; i < lineSymbols.length; i++) {
    if (lineSymbols[i] === first || lineSymbols[i] === "WILD") {
      matchCount++;
    } else {
      break;
    }
  }`
  - After: `for (const s of lineSymbols) {
    if (s === first || s === "WILD") matchCount++;
    else break;
  }`
- Use integer-safe payout arithmetic to avoid IEEE 754 drift in regulated gambling payouts. Multiply before dividing so no fractional intermediate exists when bet is divisible by 10; or adopt a Decimal library for full coverage.
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Option A: integer-first (safe when multiplier * bet stays in safe integer range)
return (multiplier * bet) / PAYLINE_COUNT;
// Option B: integer truncation if sub-coin fractions are invalid
return Math.trunc(multiplier * bet / PAYLINE_COUNT);`
- Replace magic number 10 with a named constant exported from paytable.ts to make the payline-count assumption explicit and auditable.
  - Before: `const lineBet = bet / 10;`
  - After: `import { PAYLINE_COUNT } from './paytable.js';
// ...
const lineBet = bet / PAYLINE_COUNT;`
- Add JSDoc covering the WILD substitution rule, minimum match threshold, and lineBet formula.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the coin payout for a single payline using legacy matching rules.
 *
 * WILD substitutes for the first non-WILD symbol found on the line.
 * A minimum of 3 consecutive matching symbols (left-to-right) is required.
 * Per-line bet = bet / PAYLINE_COUNT; returned value is coins.
 *
 * @param lineSymbols - Ordered symbols on the evaluated payline (typically 5).
 * @param bet - Total bet in coins (1..100 integer).
 * @returns Coin payout for this line, or 0 for no win.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
