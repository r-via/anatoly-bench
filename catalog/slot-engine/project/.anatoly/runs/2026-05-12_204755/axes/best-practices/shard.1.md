[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcstrategyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `any` with the already-defined Bet alias on both exported functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object so callers get a stack trace and can use instanceof
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES immutable at the type level
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly number[][] = [`
- Guard EngineContainer.resolve against missing keys to surface misconfiguration at the source instead of at the cast site
  - Before: `resolve<T>(key: string): T {
  return this.registry.get(key) as T;
}`
  - After: `resolve<T>(key: string): T {
  const val = this.registry.get(key);
  if (val === undefined) throw new Error(`No registration for key: "${key}"`);
  return val as T;
}`
- Inject factory/strategy/emitter as defaulted parameters to make spin() unit-testable and remove the dead unused DI variables
  - Before: `export function spin(bet: Bet): SpinResult {
  ...
  const rng = container.resolve<typeof weightedPick>("rng");          // unused
  const reelsModule = container.resolve<...>("reels");                 // unused
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();`
  - After: `export function spin(
  bet: Bet,
  factory: ReelBuilderFactory = new StandardReelBuilderFactory(),
  strategy: PayoutStrategy = new DefaultStrategy(),
  emitter: SpinEventEmitter = new SpinEventEmitter()
): SpinResult {`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to stay in sync automatically
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Use the project's `rng.ts` module instead of `Math.random()` for certifiable gambling RNG
  - Before: `const r = Math.random() * total;`
  - After: `import { randomFloat } from './rng.js';
// ...
const r = randomFloat() * total;`
- Mark module constants as readonly to prevent accidental mutation
  - Before: `const SYMBOLS: Symbol[] = [...]
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...]`
- Return a copy in `getReelWeights` to avoid exposing mutable internal state
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  const weights = REEL_WEIGHTS[reelIndex];
  if (!weights) throw new RangeError(`reelIndex ${reelIndex} out of range`);
  return [...weights];
}`
- Inject RNG function for testability
  - Before: `export function spinReel(reelIndex: number): Symbol[]`
  - After: `export function spinReel(
  reelIndex: number,
  rng: () => number = randomFloat
): Symbol[]`

### `src/strategy.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Mark input parameters readonly to enforce the purely-functional contract of both strategies.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Use integer arithmetic for the payout multiplier to avoid IEEE 754 rounding in regulated gaming code.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8)`
  - After: `totalPayout: Math.floor(result.totalPayout * 8 / 10)`
- Add JSDoc to all three exported classes.
  - Before: `export abstract class SpinStrategy {`
  - After: `/** Base strategy for adjusting spin payouts. Extend to implement custom payout curves. */
export abstract class SpinStrategy {`

### `src/freespin.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both exported functions
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across all visible reel positions.
 * @param reels - 2D array of symbol columns
 * @returns Total SCATTER count
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Replace in-place mutation with a returned new state object for immutability and testability
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  if (!state.active && scatters >= 3) {
    state.active = true;
    state.remaining = 10;
  }
}`
  - After: `export function handleFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
  if (!state.active && scatters >= 3) {
    return { ...state, active: true, remaining: 10 };
  }
  // ...
  return state;
}`
- Extract magic numbers into named constants or a config parameter for paytable configurability
  - Before: `if (!state.active && scatters >= 3) {
  state.active = true;
  state.remaining = 10;`
  - After: `const SCATTER_TRIGGER = 3;
const FREE_SPINS_AWARDED = 10;

if (!state.active && scatters >= SCATTER_TRIGGER) {
  state.active = true;
  state.remaining = FREE_SPINS_AWARDED;`

### `src/jackpot.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Add JSDoc to document the exported function's contract and jackpot condition.
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Returns true when the reel grid contains at least 4 DIAMOND symbols,
 * triggering a jackpot payout.
 * @param reels - 2-D grid of visible symbols (columns × rows).
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
- Replace magic literals with named constants for auditability in regulated gaming.
  - Before: `if (sym === "DIAMOND") diamondCount++;
}
return diamondCount >= 4;`
  - After: `const JACKPOT_SYMBOL = "DIAMOND" as const satisfies Symbol;
const JACKPOT_THRESHOLD = 4;
// ...
if (sym === JACKPOT_SYMBOL) diamondCount++;
}
return diamondCount >= JACKPOT_THRESHOLD;`
- Use flat + filter for a declarative, modern alternative to the nested loop.
  - Before: `let diamondCount = 0;
for (const col of reels) {
  for (const sym of col) {
    if (sym === "DIAMOND") diamondCount++;
  }
}
return diamondCount >= 4;`
  - After: `const diamondCount = reels.flat().filter(sym => sym === JACKPOT_SYMBOL).length;
return diamondCount >= JACKPOT_THRESHOLD;`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Mark array parameters `readonly` to signal non-mutation intent
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Inject the RNG source for testability and certifiability
  - Before: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  const roll = rng() * totalWeight;`
- Add defensive guards for empty arrays, mismatched lengths, and invalid weights
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = Math.random): T {
  if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
  if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
  if (weights.some(w => w < 0)) throw new RangeError('weightedPick: weights must be non-negative');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) throw new RangeError('weightedPick: total weight must be > 0');`
- Replace Math.random() with a certifiable CSPRNG for regulated gaming (e.g., Web Crypto API)
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `// Use a certifiable RNG; example with Web Crypto:
const randomBytes = new Uint32Array(1);
crypto.getRandomValues(randomBytes);
const roll = (randomBytes[0] / 0x100000000) * totalWeight;`
