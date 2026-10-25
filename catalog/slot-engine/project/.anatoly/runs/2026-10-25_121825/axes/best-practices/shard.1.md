[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcrngts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcfactoriests) |

## 🔍 Details

### `src/engine.ts` — 2/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)

- Replace `any` on public export parameters with the already-exported `Bet` type
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error subclass instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES immutable with as const
  - Before: `const PAYLINES: number[][] = [ ... ]`
  - After: `const PAYLINES = [ [1,1,1,1,1], [0,0,0,0,0], ... ] as const satisfies readonly (readonly number[])[];`
- Remove unused container resolutions inside spin()
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<...>("reels");`
  - After: `const paytable = container.resolve<typeof getPayMultiplier>("paytable");`
- Register the event listener once at module level, not inside spin()
  - Before: `// Inside spin():
emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `// Module level:
const emitter = new SpinEventEmitter();
emitter.on(SPIN_DONE, () => {});
// Inside spin():
emitter.emit(SPIN_DONE, finalResult);`
- Inject factory, strategy, and emitter for testability
  - Before: `export function spin(bet: Bet): SpinResult {
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();`
  - After: `export function spin(
  bet: Bet,
  deps = { factory: new StandardReelBuilderFactory(), strategy: new DefaultStrategy() }
): SpinResult {`

### `src/reels.ts` — 2.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace ReelWeightConfig interface with Record<Symbol, number> to stay in sync with the Symbol union and enable exhaustiveness checking.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants readonly to prevent accidental mutation.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...];`
  - After: `const SYMBOLS: readonly Symbol[] = [...];
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];`
- Inject an RNG function instead of calling Math.random() directly — use the project's existing rng.ts — to satisfy both regulatory requirements and testability.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const r = Math.random() * total;
  ...`
  - After: `import { nextFloat } from "./rng.js";
function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng = nextFloat): Symbol {
  const r = rng() * total;
  ...`
- Add a bounds guard in spinReel and getReelWeights to fail loudly on invalid reelIndex.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Return defensive copies from getReelSymbols and getReelWeights to prevent external mutation of internal state.
  - Before: `export function getReelSymbols(): Symbol[] {
  return SYMBOLS;
}
export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelSymbols(): readonly Symbol[] {
  return SYMBOLS;
}
export function getReelWeights(reelIndex: number): readonly number[] {
  return REEL_WEIGHTS[reelIndex];
}`

### `src/rng.ts` — 4/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use readonly parameters to signal non-mutation and enable stricter call-site checking
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Replace Math.random() with an injectable rng parameter; supply a CSPRNG as default for regulated gaming
  - Before: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = cryptoRandom,
): T {
  if (items.length === 0) throw new Error('weightedPick: items must not be empty');
  if (items.length !== weights.length) throw new Error('weightedPick: items and weights must have equal length');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;`
- Add full JSDoc with @param, @returns, @throws tags
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Selects one item from `items` with probability proportional to the corresponding `weights` entry.
 * Uses a cumulative-weight scan with a single uniform random draw.
 *
 * @param items   Non-empty array of candidates.
 * @param weights Parallel array of non-negative weights; must match `items` length.
 * @param rng     Optional uniform-[0,1) source; defaults to a CSPRNG draw.
 * @returns       The selected item.
 * @throws {Error} If `items` is empty or `items.length !== weights.length`.
 */`

### `src/factories.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add readonly to the return type so callers cannot mutate the reel grid after construction.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<readonly Symbol[]>;`
- Add JSDoc to both exported classes.
  - Before: `export abstract class AbstractReelBuilderFactory {
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
}`
  - After: `/**
 * Base factory contract for building reel grids.
 * Extend to provide alternative reel-generation strategies.
 */
export abstract class AbstractReelBuilderFactory {
  /** Build a `reelCount × rowCount` grid of symbols. */
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<readonly Symbol[]>;
}`
