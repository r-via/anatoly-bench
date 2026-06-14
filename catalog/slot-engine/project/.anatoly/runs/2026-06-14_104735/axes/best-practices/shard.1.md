[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2.5/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcstrategyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` on `bet` with the declared `Bet` alias in both public functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the upper bound on bet instead of warning silently
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Fix the house edge direction so payouts decrease toward a 95% RTP
  - Before: `if (total > 0) {
  total = total * (1 + HOUSE_EDGE);
}`
  - After: `if (total > 0) {
  total = total * (1 - HOUSE_EDGE);
}`
- Mark PAYLINES immutable with `as const` and a readonly type
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ... entries unchanged
] as const satisfies ReadonlyArray<readonly number[]>;`
- Remove or use the dead DI resolutions inside `spin()`
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
// ...
const reelsModule = container.resolve<{ ... }>("reels");`
  - After: `// Pass rng into factory, or remove the container.register("rng", ...) / container.register("reels", ...) calls if DI is not used.`
- Accept collaborators as parameters to make `spin()` testable
  - Before: `export function spin(bet: Bet): SpinResult {
  // ...
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();`
  - After: `export function spin(
  bet: Bet,
  factory = new StandardReelBuilderFactory(),
  strategy = new DefaultStrategy(),
  emitter = new SpinEventEmitter()
): SpinResult {`

### `src/reels.ts` — 2.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace ReelWeightConfig interface with Record<Symbol, number> to stay structurally coupled to the Symbol union.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark all module-level constants readonly / as const.
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS = [
  "CHERRY","LEMON","BELL","BAR","SEVEN","DIAMOND","WILD","SCATTER",
] as const satisfies readonly Symbol[];
const DEFAULT_WEIGHTS = { CHERRY:25,LEMON:25,BELL:15,BAR:10,SEVEN:5,DIAMOND:30,WILD:5,SCATTER:5 } satisfies ReelWeightConfig;
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...]`
- Replace Math.random() with crypto.getRandomValues() for certifiable gaming RNG.
  - Before: `const r = Math.random() * total;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const r = (buf[0] / 0x1_0000_0000) * total;`
- Inject RNG to enable deterministic unit tests.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {`
  - After: `function pickFromWeighted(
  items: readonly Symbol[],
  wts: readonly number[],
  rng: () => number = Math.random,
): Symbol {`
- Add bounds guard in spinReel and return a copy from getReelWeights.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`

### `src/strategy.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to all three public exports to meet documentation standards and aid consumers.
  - Before: `export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
  - After: `/**
 * Base contract for payout adjustment strategies.
 * Implement this to customise house-edge behaviour per session or game mode.
 */
export abstract class SpinStrategy {
  /** Transforms a raw spin result, returning a (possibly adjusted) copy. */
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
- Document the 0.8 coefficient in `ConservativeStrategy` so future maintainers understand its effect on RTP relative to the documented 95% target.
  - Before: `export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return {
      ...result,
      totalPayout: Math.floor(result.totalPayout * 0.8),
    };
  }
}`
  - After: `/**
 * Reduces totalPayout to 80 % of the engine's raw value.
 * NOTE: this pushes effective RTP below the documented 95 % target; use only
 * where intentionally tighter house margins are acceptable (e.g. bonus-abuse mitigation).
 */
export class ConservativeStrategy extends SpinStrategy {
  adjustPayout(result: SpinResult): SpinResult {
    return {
      ...result,
      totalPayout: Math.floor(result.totalPayout * 0.8),
    };
  }
}`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports documenting parameters, return value, and mutation semantics
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across the entire reel grid (all positions, not paylines).
 * @param reels - 5×3 grid of symbols
 * @returns Total SCATTER count
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Add JSDoc to handleFreeSpins documenting mutation contract and retrigger behaviour
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Mutates `state` in place to advance the free-spin lifecycle.
 * - Not active + ≥3 scatters → activates, sets remaining = 10
 * - Active + ≥3 scatters → retrigger, adds 10 to remaining
 * - Active + <3 scatters → decrements remaining; deactivates at 0
 * @param state - Persistent free-spin state (mutated in place)
 * @param scatters - Scatter count from the current spin
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
- Rename `Symbol` in types.ts to avoid shadowing the built-in TypeScript global
  - Before: `import type { FreeSpinState, Symbol } from "./types.js";`
  - After: `import type { FreeSpinState, SlotSymbol as Symbol } from "./types.js";`

### `src/rng.ts` — 5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace `Math.random()` with an injected RNG function, satisfying both testability (Rule 15) and allowing callers to supply a CSPRNG for regulated gaming compliance (Rule 13).
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;`
- For regulated gaming, supply a CSPRNG via the Node.js `crypto` module instead of relying on `Math.random` as the default.
  - Before: `// caller:
const symbol = weightedPick(symbols, weights);`
  - After: `import { randomBytes } from 'node:crypto';

function cryptoRng(): number {
  const buf = randomBytes(4);
  return buf.readUInt32BE(0) / 0x1_0000_0000;
}

// caller:
const symbol = weightedPick(symbols, weights, cryptoRng);`
- Mark array parameters as readonly to communicate the non-mutating contract (Rule 5).
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

### `src/legacy.ts` — 7.5/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Use ReadonlyArray for the lineSymbols parameter to signal immutability to callers.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace floating-point payout with integer arithmetic to satisfy regulated gaming precision requirements.
  - Before: `const multiplier = getPayMultiplier(first, matchCount);
const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `const multiplier = getPayMultiplier(first, matchCount);
// Keep in integer coin-units; caller converts to display units
return Math.trunc(multiplier * bet / LINE_COUNT);`
- Replace magic numbers with named constants.
  - Before: `if (matchCount < 3) return 0;
const lineBet = bet / 10;`
  - After: `import { MIN_MATCH, LINE_COUNT } from "./paytable.js";
// ...
if (matchCount < MIN_MATCH) return 0;
const lineBet = bet / LINE_COUNT;`
- Add JSDoc to document the contract, including the per-line-bet assumption and edge cases.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the legacy line payout for a single payline.
 * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
 * @param bet - Total bet in coins (1..100, integer). Divided by LINE_COUNT for per-line bet.
 * @returns Payout in coins (0 if no qualifying run).
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
