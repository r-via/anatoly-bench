[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcstrategyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcrngts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srceventsts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)

- Type the bet parameter as `Bet` in the public API
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `export function spin(bet: Bet): SpinResult {`
- Throw an Error instead of a string
  - Before: `throw "invalid bet";`
  - After: `throw new RangeError(`invalid bet: ${String(bet)}`);`
- Make PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<ReadonlyArray<number>> = [`
- Inject dependencies into spin via an optional parameter and drop the untyped container
  - Before: `const factory = new StandardReelBuilderFactory();
const strategy = new DefaultStrategy();`
  - After: `export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult {
  const { factory, strategy, emitter } = deps;`
- Reuse the wild count computed in evaluateLine instead of recomputing it in spin
  - Before: `for (const w of wins) { ... wc ... }`
  - After: `// return wildCount in LineWin and compute wildMultiplier from wins`

### `src/paytable.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Type the pay table by symbol and make it immutable
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {`
  - After: `const PAY_TABLE = {
  CHERRY: [2, 5, 25],
  // ...
} as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;`
- Replace the if-chain with an index lookup and add JSDoc
  - Before: `if (count === 3) return row[0];
if (count === 4) return row[1];
if (count === 5) return row[2];
return 0;`
  - After: `/** Returns the pay multiplier for `count` (3-5) matching `symbol`, or 0. */
const idx = count - 3;
return idx >= 0 && idx < row.length ? row[idx] : 0;`

### `src/reels.ts` — 4.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Inject the RNG, and reuse the project's rng.ts instead of Math.random
  - Before: `const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rand: () => number): Symbol {
  const r = rand() * total;`
- Derive weights from the symbol list and freeze the tables
  - Before: `interface ReelWeightConfig { CHERRY: number; ... }
const SYMBOLS: Symbol[] = [...];`
  - After: `const SYMBOLS = ["CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER"] as const satisfies readonly Symbol[];
const DEFAULT_WEIGHTS: Readonly<Record<Symbol, number>> = {...};
const weightsToArray = (cfg: Readonly<Record<Symbol, number>>) => SYMBOLS.map(s => cfg[s]);`
- Validate reelIndex and return read-only views
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `/** Returns the weight table for a reel. @throws RangeError if reelIndex is out of range. */
export function getReelWeights(reelIndex: number): readonly number[] {
  const w = REEL_WEIGHTS[reelIndex];
  if (!w) throw new RangeError(`Invalid reel index: ${reelIndex}`);
  return w;
}`

### `src/strategy.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Document the exports and extract the magic factor into a named constant.
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
  }
}`
  - After: `const CONSERVATIVE_PAYOUT_FACTOR = 0.8;

/** Reduces the total payout by 20%, rounding down. */
export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return { ...result, totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_PAYOUT_FACTOR) };
  }
}`

### `src/rng.ts` — 5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Use a CSPRNG and inject the random source. Validate inputs and use readonly arrays.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = secureRandom, // e.g. crypto.getRandomValues-based [0,1)
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new Error('items and weights must be non-empty and equal length');
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (!(totalWeight > 0)) throw new Error('total weight must be positive');
  const roll = random() * totalWeight;`

### `src/events.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Make the listeners map readonly
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners = new Map<string, EventHandler[]>();`
- Add JSDoc to the public API
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `/** Event name emitted when a spin completes. */
export const SPIN_DONE = "spin:done";`
- Use a typed event map
  - Before: `type EventHandler = (...args: unknown[]) => void;`
  - After: `type EventMap = { 'spin:done': [result: SpinResult] };
class SpinEventEmitter {
  on<K extends keyof EventMap>(event: K, handler: (...args: EventMap[K]) => void): void { /* ... */ }
}`
