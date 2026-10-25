[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 6.5/10 | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfactoriests) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcstrategyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcfreespints) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Replace `any` with the exported `Bet` type and throw a proper Error with a range check that enforces the documented 1..100 limit.
  - Before: `export function spin(bet: any): SpinResult {
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `export function spin(bet: Bet): SpinResult {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new RangeError(`invalid bet: ${bet}; expected an integer in 1..100`);
  }`
- Make PAYLINES immutable and checked.
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies ReadonlyArray<readonly number[]>;`
- Inject collaborators with defaults, and drop the untyped container.
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const factory = new StandardReelBuilderFactory();`
  - After: `export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult {
  const { factory, strategy, emitter, paytable } = deps;`
- Fix the payout math. Apply the house edge as a reduction, work in integer minor units, and drop the unconditional per-spin bonus.
  - Before: `total = total * (1 + HOUSE_EDGE);
}
total += bet * 0.01;
return Math.ceil(total);`
  - After: `return Math.floor(total * (1 - HOUSE_EDGE));`

### `src/paytable.ts` — 6.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Key the pay table by the payable symbol union and make it immutable with satisfies
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY: [2, 5, 25],
  ...
};`
  - After: `const PAY_TABLE = {
  CHERRY: [2, 5, 25],
  ...
} as const satisfies Partial<Record<Symbol, readonly [number, number, number]>>;`
- Add JSDoc to public exports
  - Before: `export function getPayMultiplier(symbol: Symbol, count: number): number {`
  - After: `/** Returns the pay multiplier for `count` (3-5) consecutive matches of `symbol`; 0 if unpaid. */
export function getPayMultiplier(symbol: Symbol, count: number): number {`
- Use readonly input and parenthesize the mixed ternary/nullish expression
  - Before: `export function lineWins(symbols: Symbol[]) {
  const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];`
  - After: `export function lineWins(symbols: readonly Symbol[]) {
  const first = symbols[0] === "WILD" ? (symbols.find(s => s !== "WILD") ?? "WILD") : symbols[0];`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use an injectable, cryptographically secure RNG instead of Math.random (reuse rng.ts)
  - Before: `const r = Math.random() * total;`
  - After: `const r = rng.nextFloat() * total; // rng injected, CSPRNG-backed`
- Replace the hand-written config interface with Record and make the data readonly
  - Before: `interface ReelWeightConfig { CHERRY: number; ... }
const SYMBOLS: Symbol[] = [...]`
  - After: `type ReelWeightConfig = Readonly<Record<ReelSymbol, number>>;
const SYMBOLS = ["CHERRY", ...] as const satisfies readonly ReelSymbol[];`
- Validate reelIndex and avoid leaking internal arrays
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  const w = REEL_WEIGHTS[reelIndex];
  if (!w) throw new RangeError(`Invalid reel index: ${reelIndex}`);
  return w;
}`

### `src/factories.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Rename imported `Symbol` type to avoid shadowing the global `Symbol`, and add JSDoc.
  - Before: `import type { Symbol } from "./types.js";

export abstract class AbstractReelBuilderFactory {
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
}`
  - After: `import type { Symbol as ReelSymbol } from "./types.js";

/** Builds a grid of reels for a spin. */
export abstract class AbstractReelBuilderFactory {
  /** @returns one symbol array per reel. */
  abstract buildReels(reelCount: number, rowCount: number): ReelSymbol[][];
}`
- Inject the reel spinner for testability and honor rowCount.
  - Before: `reels.push(spinReel(i));`
  - After: `reels.push(this.spin(i, rowCount));`

### `src/strategy.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc and extract the magic number.
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return { ...result, totalPayout: Math.floor(result.totalPayout * 0.8) };
  }
}`
  - After: `/** Reduces payouts to 80%, rounded down to whole credits. */
export class ConservativeStrategy extends SpinStrategy {
  private static readonly PAYOUT_FACTOR = 0.8;
  override adjustPayout(result: Readonly<SpinResult>): SpinResult {
    return { ...result, totalPayout: Math.floor(result.totalPayout * ConservativeStrategy.PAYOUT_FACTOR) };
  }
}`

### `src/rng.ts` — 0/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use a CSPRNG, inject the random source, validate inputs, and mark the parameters readonly
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `import { randomInt } from 'node:crypto';

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: (maxExclusive: number) => number = randomInt,
): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new Error('items and weights must be non-empty and the same length');
  }
  // integer weights assumed; reject negative or non-finite values
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = random(totalWeight);`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Keep payouts in integer coins. Compute the multiplier first and divide last, with explicit rounding. Mark the input readonly and add JSDoc.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  ...
  const lineBet = bet / 10;
  return multiplier * lineBet;`
  - After: `/** Legacy payout for one payline; returns integer coins. */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ...
  return Math.floor((multiplier * bet) / 10);`

### `src/freespin.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Extract magic numbers into named constants and add JSDoc
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;`
  - After: `const SCATTER_TRIGGER = 3;
const FREE_SPINS_AWARD = 10;

/** Starts or retriggers free spins on 3+ scatters; otherwise consumes one spin. */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= SCATTER_TRIGGER) {
    state.active = true;
    state.remaining = FREE_SPINS_AWARD;`
- Rename the `Symbol` type to avoid shadowing the global
  - Before: `import type { FreeSpinState, Symbol } from "./types.js";`
  - After: `import type { FreeSpinState, ReelSymbol } from "./types.js";`
