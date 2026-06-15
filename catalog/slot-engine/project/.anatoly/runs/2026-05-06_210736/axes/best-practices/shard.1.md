[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/reels.ts` | 🔴 CRITICAL | 3/10 | [details](#srcreelsts) |
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcstrategyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 8.75/10 | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace `Math.random()` with the project's own RNG module to satisfy regulated gaming compliance.
  - Before: `const r = Math.random() * total;`
  - After: `import { nextFloat } from './rng.js';
const r = nextFloat() * total;`
- Use `Record<Symbol, number>` to avoid manually mirroring the Symbol union in ReelWeightConfig.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level constants as deeply readonly and use `as const` / `satisfies` for stronger types.
  - Before: `const SYMBOLS: Symbol[] = ["CHERRY", ...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };
const REEL_WEIGHTS: number[][] = [...];`
  - After: `const SYMBOLS = ["CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER"] as const satisfies readonly Symbol[];
const DEFAULT_WEIGHTS = { CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10, SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5 } as const satisfies ReelWeightConfig;
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];`
- Inject RNG as a parameter to make `pickFromWeighted` purely deterministic for testing.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
  const r = rng() * total;`
- Return a copy from `getReelWeights` to prevent external mutation of internal state.
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  return [...REEL_WEIGHTS[reelIndex]];
}`

### `src/engine.ts` — 3/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` with `number` on both public function signatures
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: number): number
export function spin(bet: number): SpinResult`
- Fix inverted HOUSE_EDGE formula — multiply by (1 − edge) to reduce payout toward 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw Error instances instead of string literals
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES as deeply readonly to prevent mutation and enable narrower inference
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // same values
] as const satisfies readonly (readonly number[])[];`
- Hoist emitter to module level and drop the per-spin no-op listener to prevent unbounded growth
  - Before: `const emitter = new SpinEventEmitter();
// ...
emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `// module level
const emitter = new SpinEventEmitter();
// inside spin() — emit only, no new listener
emitter.emit(SPIN_DONE, finalResult);`
- Either use the resolved `rng` in factory construction or remove the dead container registrations
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
// rng never used — factory ignores it
const reelsModule = container.resolve<...>("reels"); // also unused`
  - After: `const rng = container.resolve<typeof weightedPick>("rng");
const reels = factory.buildReels(5, 3, rng); // pass rng so container registration has effect`

### `src/paytable.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Constrain PAY_TABLE key to Symbol and use `satisfies` + `as const` for full type-safety and immutability
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY: [2, 5, 25],
  // …
};`
  - After: `const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Record<Symbol, readonly [number, number, number]>;`
- Add JSDoc to all public exports, documenting the RTP constant's origin and each function's contract
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {`
  - After: `/** Base RTP target for the Ancient-theme game variant (95%). */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the payout multiplier for a given symbol and match count.
 * Returns 0 for WILD, SCATTER, or counts below 3.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {`
- Guard against empty `symbols` array to satisfy `noUncheckedIndexedAccess` and clarify intent
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];`
  - After: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {
  if (symbols.length === 0) return null;
  const first = symbols[0] === "WILD" ? symbols.find(s => s !== "WILD") ?? "WILD" : symbols[0];`

### `src/strategy.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to all three public exports to surface the ADR semantics at the declaration site.
  - Before: `export abstract class SpinStrategy {
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
  - After: `/**
 * Extension point for post-calculation payout adjustment.
 * Implement this class to apply market-specific or volatility-specific
 * payout policies without modifying engine.ts (see ADR-003).
 */
export abstract class SpinStrategy {
  /** Returns a (possibly modified) copy of `result` with adjusted payout fields. */
  abstract adjustPayout(result: SpinResult): SpinResult;
}`
- Use `Readonly<SpinResult>` on the parameter to express immutability intent and prevent accidental mutation.
  - Before: `adjustPayout(result: SpinResult): SpinResult`
  - After: `adjustPayout(result: Readonly<SpinResult>): SpinResult`
- Replace float-factor multiplication with integer arithmetic for deterministic payout precision in regulated gaming context.
  - Before: `totalPayout: Math.floor(result.totalPayout * 0.8),`
  - After: `totalPayout: Math.floor(result.totalPayout * 4 / 5),`

### `src/freespin.ts` — 8.75/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Extract magic numbers into named constants to prevent drift and satisfy no-magic-numbers lint rule
  - Before: `if (!state.active && scatters >= 3) {
    state.remaining = 10;
  } else if (state.active && scatters >= 3) {
    state.remaining += 10;`
  - After: `const SCATTER_TRIGGER = 3;
const FREE_SPINS_AWARD = 10;

if (!state.active && scatters >= SCATTER_TRIGGER) {
    state.remaining = FREE_SPINS_AWARD;
  } else if (state.active && scatters >= SCATTER_TRIGGER) {
    state.remaining += FREE_SPINS_AWARD;`
- Add JSDoc to both public exports
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts all SCATTER symbols visible across the full grid.
 * @param reels - 5×3 reel window (columns of symbols)
 * @returns total number of SCATTER symbols found
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Consider a pure variant of handleFreeSpins that returns a new state for easier unit testing
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {
  // mutates state in place
}`
  - After: `export function applyFreeSpins(state: Readonly<FreeSpinState>, scatters: number): FreeSpinState {
  if (!state.active && scatters >= SCATTER_TRIGGER) {
    return { ...state, active: true, remaining: FREE_SPINS_AWARD };
  }
  if (state.active && scatters >= SCATTER_TRIGGER) {
    return { ...state, remaining: state.remaining + FREE_SPINS_AWARD };
  }
  if (state.active) {
    const remaining = state.remaining - 1;
    return { ...state, remaining, active: remaining > 0 };
  }
  return state;
}`

### `src/legacy.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Use readonly on the input parameter to reflect its immutability contract
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Replace floating-point division with integer coin arithmetic to avoid precision drift in regulated payout calculations
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// bet is in coins; lineBet is scaled by 10 (10 lines). Keep all arithmetic in integer coins.
const lineBetCoins = Math.trunc(bet / 10);
return multiplier * lineBetCoins;`
- Add JSDoc to the public export
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Legacy payout calculation (pre-wild-escalation engine).
 * @param lineSymbols - Ordered symbols on the evaluated payline (left to right).
 * @param bet - Total bet in coins across all 10 lines.
 * @returns Coins awarded for this line, or 0 for no qualifying match.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace `Math.random()` with an injectable CSPRNG function. Fixes both the security/compliance violation (rule 13) and the testability issue (rule 15).
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  randomFn: () => number = () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  },
): T {
  const roll = randomFn() * totalWeight;`
- Add input guards to prevent silent undefined returns and NaN-corrupted distributions.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  if (items.length === 0) throw new RangeError('items must be non-empty');
  if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');`
- Mark array parameters readonly to enforce caller immutability contracts.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
