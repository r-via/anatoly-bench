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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcrngts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srceventsts) |

## 🔍 Details

### `src/engine.ts` — 2.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)

- Type `bet` as `Bet` and throw an `Error` (reject out-of-range values per the README's 1..100 range)
  - Before: `export function spin(bet: any): SpinResult {
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `/** Runs one full spin for an integer bet of 1..100 coins. */
export function spin(bet: Bet): SpinResult {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`invalid bet: ${bet}`);
  }`
- Make paylines immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies ReadonlyArray<readonly number[]>;`
- Remove the unused service-locator lookups and inject the collaborators instead
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const factory = new StandardReelBuilderFactory();`
  - After: `export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult {
  const { factory, strategy, emitter, paytable } = deps;`

### `src/paytable.ts` — 7.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)

- Make PAY_TABLE immutable and keyed by payable symbols, validated with satisfies
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2, 5, 25],
  ...
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2, 5, 25],
  LEMON:   [2, 5, 25],
  BELL:    [5, 20, 100],
  BAR:     [10, 40, 200],
  SEVEN:   [25, 100, 500],
  DIAMOND: [50, 250, 1000],
} as const satisfies Record<string, readonly [number, number, number]>;`
- Replace the count branches with an index lookup
  - Before: `if (count === 3) return row[0];
if (count === 4) return row[1];
if (count === 5) return row[2];
return 0;`
  - After: `return row[count - 3] ?? 0;`
- Add JSDoc to public exports and use readonly parameters
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `/** Resolves a payline's winning symbol and run length (WILD substitutes; SCATTER never pays). */
export function lineWins(symbols: readonly Symbol[]): { readonly symbol: Symbol; readonly count: number } | null {`

### `src/reels.ts` — 4.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)

- Derive the weight config from the Symbol union and make the data readonly
  - Before: `interface ReelWeightConfig { CHERRY: number; LEMON: number; ... }
const SYMBOLS: Symbol[] = [...];`
  - After: `type ReelWeightConfig = Readonly<Record<Symbol, number>>;
const SYMBOLS = ["CHERRY","LEMON","BELL","BAR","SEVEN","DIAMOND","WILD","SCATTER"] as const satisfies readonly Symbol[];`
- Use a certified or injected RNG instead of Math.random
  - Before: `const r = Math.random() * total;`
  - After: `import { randomInt } from "node:crypto";
const r = randomInt(0, total);`
- Validate reelIndex and throw an Error
  - Before: `const weights = REEL_WEIGHTS[reelIndex];`
  - After: `const weights = REEL_WEIGHTS[reelIndex];
if (!weights) throw new RangeError(`Invalid reel index: ${reelIndex}`);`
- Build the per-reel weights with Array.from
  - Before: `const REEL_WEIGHTS: number[][] = [weightsToArray(DEFAULT_WEIGHTS), ... ];`
  - After: `const REEL_WEIGHTS: readonly (readonly number[])[] = Array.from({ length: 5 }, () => weightsToArray(DEFAULT_WEIGHTS));`

### `src/rng.ts` — 3/10

**Failed rules:**

- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)

- Use an injectable, cryptographically secure RNG, validate inputs, and mark params readonly
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32,
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new RangeError('items and weights must be non-empty and equal length');
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (!(totalWeight > 0)) throw new RangeError('total weight must be positive');
  const roll = random() * totalWeight;`

### `src/strategy.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc and extract the magic multiplier into a named, injectable constant
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
  }
}`
  - After: `const CONSERVATIVE_FACTOR = 0.8;

/** Reduces payouts by 20%, rounded down. */
export class ConservativeStrategy extends SpinStrategy {
  override adjustPayout(result: SpinResult): SpinResult {
    return { ...result, totalPayout: Math.floor(result.totalPayout * CONSERVATIVE_FACTOR) };
  }
}`
- Use an interface for the strategy contract
  - Before: `export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
  - After: `export interface SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult;
}`

### `src/events.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Mark the listener map readonly
  - Before: `private listeners: Map<string, EventHandler[]> = new Map();`
  - After: `private readonly listeners = new Map<string, EventHandler[]>();`
- Add JSDoc to exports
  - Before: `export const SPIN_DONE = "spin:done";`
  - After: `/** Event name emitted when a spin completes. */
export const SPIN_DONE = "spin:done";`
- Type the event map for typed handler arguments
  - Before: `type EventHandler = (...args: unknown[]) => void;
emit(event: string, ...args: unknown[]): void`
  - After: `interface SpinEvents { [SPIN_DONE]: [result: SpinResult] }
emit<K extends keyof SpinEvents>(event: K, ...args: SpinEvents[K]): void`
- Isolate handler failures in emit
  - Before: `for (const handler of handlers) {
  handler(...args);
}`
  - After: `for (const handler of [...handlers]) {
  try { handler(...args); } catch (err) { console.error(err); }
}`
