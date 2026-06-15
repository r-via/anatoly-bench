[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 1/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 13: Security (CRITICAL)

- Replace `bet: any` with `Bet` on both public functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number {
export function spin(bet: any): SpinResult {`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number {
export function spin(bet: Bet): SpinResult {`
- Fix house-edge direction so payout is reduced to 95% RTP, not inflated to 105%
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE); // reduces to ~95% of raw line-win total`
- Throw an Error instance to satisfy no-throw-literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("Invalid bet: must be a positive integer in [1, 100]");`
- Remove or wire the unused container resolves for rng and reelsModule
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `// Either delete these lines, or replace factory.buildReels() with calls through rng/reelsModule to honour the DI contract`
- Make PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<readonly number[]> = [`
- Guard EngineContainer.resolve against missing keys
  - Before: `resolve<T>(key: string): T {
  return this.registry.get(key) as T;
}`
  - After: `resolve<T>(key: string): T {
  if (!this.registry.has(key)) throw new Error(`DI: no binding for '${key}'`);
  return this.registry.get(key) as T;
}`
- Use integer arithmetic for monetary values to avoid IEEE 754 drift
  - Before: `total += bet * 0.01;
return Math.ceil(total);`
  - After: `// Work in integer cents throughout, convert only at display boundary
const totalCents = Math.round(total * 100) + Math.round(bet * 1); // bet*0.01 coins = 1 cent per bet unit
return Math.ceil(totalCents / 100);`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace ReelWeightConfig with Record<Symbol, number> to stay in sync with the Symbol union type
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Mark module-level data structures as readonly and use satisfies for type-checked literals
  - Before: `const SYMBOLS: Symbol[] = [...];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...];
`
  - After: `const SYMBOLS = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const satisfies ReadonlyArray<Symbol>;

const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} as const satisfies Readonly<ReelWeightConfig>;

const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
`
- Inject RNG so spinReel is testable and compliant; add bounds guard
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const r = Math.random() * total;
  ...
}
export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];
  ...
}`
  - After: `import { nextFloat } from "./rng.js"; // use certified RNG module

function pickFromWeighted(items: ReadonlyArray<Symbol>, wts: ReadonlyArray<number>): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = nextFloat() * total;
  ...
}
export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  ...
}`
- Return a copy from getReelWeights to enforce the documented read-only contract
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  return REEL_WEIGHTS[reelIndex]; // ReadonlyArray prevents callers from mutating
}`

### `src/freespin.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across the entire reel grid (all positions, not paylines only).
 * @param reels - 5×3 grid of symbols (columns × rows)
 * @returns Total scatter symbol count
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Add JSDoc to handleFreeSpins describing retrigger and deactivation semantics
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Mutates FreeSpinState in place.
 * - Not active + ≥3 scatters → activates, sets remaining = 10
 * - Active + ≥3 scatters → adds 10 to remaining (retrigger)
 * - Active + <3 scatters → decrements remaining; deactivates when it reaches 0
 * @param state - Mutable free spin session state
 * @param scatters - Value from detectScatters for the current spin
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
- Cap retrigger accumulation for regulated-gaming compliance
  - Before: `} else if (state.active && scatters >= 3) {
    state.remaining += 10;`
  - After: `const MAX_FREE_SPINS_REMAINING = 100; // jurisdictional cap (GLI-11 / operator rule)

} else if (state.active && scatters >= 3) {
    state.remaining = Math.min(state.remaining + 10, MAX_FREE_SPINS_REMAINING);`

### `src/rng.ts` — 3/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Inject the RNG function and add readonly parameters for testability and immutability
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = Math.random,
): T {
  if (items.length !== weights.length || items.length === 0) {
    throw new Error(`weightedPick: items (${items.length}) and weights (${weights.length}) must be non-empty and equal length`);
  }
  const roll = rng() * totalWeight;`
- Replace Math.random() with a CSPRNG for certified gaming compliance
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x1_0000_0000) * totalWeight;`
- Add @param and @returns JSDoc tags
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 *
 * @param items - Candidate values to pick from.
 * @param weights - Corresponding non-negative weights (must match `items` length).
 * @param rng - Optional RNG source; defaults to `Math.random`. Inject a CSPRNG in production.
 * @returns The selected item.
 */`

### `src/legacy.ts` — 7.5/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Mark the parameter as read-only to enforce immutability at the call site
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace floating-point line-bet division with integer coin arithmetic to guarantee exact payouts in a regulated gaming context
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Work in whole coins; LINE_COUNT = 10 paylines
const LINE_COUNT = 10;
const payout = multiplier * bet;
// Integer division — fractional coins are not issued
return Math.floor(payout / LINE_COUNT);`
- Extract the hardcoded payline count to a named constant or parameter
  - Before: `const lineBet = bet / 10;`
  - After: `const LINE_COUNT = 10; // number of active paylines
const lineBet = bet / LINE_COUNT;`
- Add JSDoc to the public export
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the payout for a single payline using the legacy (v1) algorithm.
 * WILD substitutes for any non-SCATTER symbol; SCATTER and all-WILD lines return 0.
 * Requires a consecutive run of ≥ 3 matching symbols from the left.
 * @param lineSymbols - Ordered symbols on the evaluated payline.
 * @param bet - Total bet in coins (1–100 integer).
 * @returns Payout in coins, or 0 if no qualifying run.
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
