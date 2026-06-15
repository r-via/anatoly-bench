[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcjackpotts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `any` with the already-exported `Bet` type on both public functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error instance instead of a string literal to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error(`Invalid bet: ${bet}. Must be an integer between 1 and 100.`);`
- Enforce the bet upper bound (per arbitrated contract: Bet = 1..100)
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`Bet ${bet} exceeds maximum of 100.`);`
- Declare PAYLINES as a readonly const to prevent mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies readonly (readonly number[])[];`
- Register factory/strategy/emitter in the DI container so spin() has no hidden dependencies
  - Before: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();
const emitter = new SpinEventEmitter();`
  - After: `// At module init:
container.register("factory", new StandardReelBuilderFactory());
container.register("strategy", new DefaultStrategy());
container.register("emitter", new SpinEventEmitter());

// Inside spin():
const factory = container.resolve<StandardReelBuilderFactory>("factory");
const strategy = container.resolve<DefaultStrategy>("strategy");
const emitter = container.resolve<SpinEventEmitter>("emitter");`
- Add JSDoc to the primary public export `spin()`
  - Before: `export function spin(bet: Bet): SpinResult {`
  - After: `/**
 * Executes a single slot spin for the given bet amount.
 * @param bet - Integer coin bet in range [1, 100].
 * @returns Full SpinResult including reel grid, line wins, scatter/jackpot state, and total payout.
 * @throws {Error} If bet is not a positive integer.
 */
export function spin(bet: Bet): SpinResult {`

### `src/paytable.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Make PAY_TABLE fully immutable using as const + satisfies
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  ....
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;`
- Extract named return type and mark parameter as readonly
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export type LineMatch = { readonly symbol: Symbol; readonly count: number };

export function lineWins(symbols: readonly Symbol[]): LineMatch | null {`
- Add JSDoc to all public exports
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {

export function lineWins(symbols: Symbol[]): ... {`
  - After: `/** Theoretical Return-to-Player for this paytable (0.95 = 95%). */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the base payout multiplier for a given pay symbol and run length.
 * Returns 0 for WILD, SCATTER, or counts outside [3, 5].
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {

/**
 * Evaluates a payline's symbols for a winning run from position 0.
 * WILDs substitute for any pay symbol. Returns null if no 3+ run is found.
 */
export function lineWins(symbols: readonly Symbol[]): LineMatch | null {`

### `src/reels.ts` — 5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's src/rng.ts module to satisfy gaming certification requirements.
  - Before: `const r = Math.random() * total;`
  - After: `import { random } from './rng.js';
// ...
const r = random() * total;`
- Use Record<Symbol, number> instead of manually listing every key in ReelWeightConfig.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark all module-level constants as readonly to prevent accidental in-place mutation.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS: ReadonlyArray<Symbol> = [...] as const;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];`
- Return ReadonlyArray<number> from getReelWeights to prevent callers from mutating certified reel state.
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  return REEL_WEIGHTS[reelIndex];
}`
- Add bounds validation to spinReel to surface invalid indices immediately rather than silently returning wrong symbols.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with crypto.getRandomValues() to satisfy regulated gaming RNG requirements
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x100000000) * totalWeight;`
- Inject rng function for deterministic unit testing
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = cryptoRng,
): T {`
- Add readonly to parameter types and guard against empty arrays
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = cryptoRng): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) throw new RangeError('weightedPick: total weight must be > 0');`

### `src/factories.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` to match the authoritative `SpinResult.reels` contract and prevent post-factory mutation.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];

buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;

buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Inject the spin function for testability instead of relying on the static import.
  - Before: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    ...
    reels.push(spinReel(i));
  }
}`
  - After: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  constructor(private readonly spin: (index: number) => Symbol[] = spinReel) {
    super();
  }
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
    ...
    reels.push(this.spin(i));
  }
}`
- Add JSDoc to public exports.
  - Before: `export abstract class AbstractReelBuilderFactory {`
  - After: `/**
 * Base factory for constructing reel grids. Implement `buildReels` to
 * produce a `reelCount × rowCount` symbol matrix.
 */
export abstract class AbstractReelBuilderFactory {`

### `src/jackpot.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to `isJackpotHit` so tooling and consumers get inline documentation.
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Returns `true` when 4 or more DIAMOND symbols appear anywhere across the
 * full reel grid in a single spin (threshold is hardcoded per design).
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
