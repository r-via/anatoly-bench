[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 4/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcpaytablets) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 6.5/10 | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 4/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)

- Replace `bet: any` with the `Bet` type already defined in this file
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Throw an Error object instead of a string to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove unused container resolutions and the no-op listener, or wire them into actual usage
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const reelsModule = container.resolve<...>("reels");
// ...
emitter.on(SPIN_DONE, () => {});`
  - After: `// Remove rng and reelsModule if factory.buildReels does not use them,
// or pass rng into factory. Remove the no-op emitter.on entirely.`
- Make PAYLINES deeply immutable
  - Before: `const PAYLINES: number[][] = [...]`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies readonly number[][];`
- Type EngineContainer.resolve to return T | undefined and guard call sites
  - Before: `resolve<T>(key: string): T {
  return this.registry.get(key) as T;
}`
  - After: `resolve<T>(key: string): T {
  const value = this.registry.get(key);
  if (value === undefined) throw new Error(`No binding for key: ${key}`);
  return value as T;
}`
- Add JSDoc to the exported `spin` function
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `/**
 * Executes a single slot spin for the given bet amount.
 * @param bet - Integer coin bet in [1, 100].
 * @returns A SpinResult containing reels, line wins, and payout.
 * @throws {Error} When bet is not a positive integer.
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 13: Security (CRITICAL)

- Route all random draws through the project's dedicated RNG module and accept it as a parameter for testability
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `import { nextFloat } from './rng.js';

function pickFromWeighted(items: Symbol[], wts: number[], rng = nextFloat): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use Record<Symbol, number> and make all module-level data immutable
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `type ReelWeightConfig = Record<Symbol, number>;
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... } as const;
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [ ... ];`
- Precompute weight totals and return readonly slices from public accessors
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const REEL_TOTALS: ReadonlyArray<number> = REEL_WEIGHTS.map(w => w.reduce((a, b) => a + b, 0));

export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) throw new RangeError(`reelIndex ${reelIndex} out of range`);
  return REEL_WEIGHTS[reelIndex];
}`
- Add JSDoc to all three public exports documenting valid reelIndex range
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spins a single reel column.
 * @param reelIndex - Integer in [0, 4] selecting the reel.
 * @returns Array of 3 symbols for rows top→bottom.
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/paytable.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Narrow PAY_TABLE key type and lock values with `satisfies` + `as const` for full immutability and type safety
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY: [2, 5, 25],
  // ...
};`
  - After: `type PaySymbol = Exclude<Symbol, "WILD" | "SCATTER">;

const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  LEMON:   [2,   5,   25],
  BELL:    [5,   20,  100],
  BAR:     [10,  40,  200],
  SEVEN:   [25,  100, 500],
  DIAMOND: [50,  250, 1000],
} as const satisfies Record<PaySymbol, readonly [number, number, number]>;`
- Add JSDoc to all public exports, especially the opaque `ANCIENT_RTP` constant
  - Before: `export const ANCIENT_RTP = 0.95;`
  - After: `/**
 * Theoretical Return-to-Player for the base game (95%).
 * Used as the mathematical target for reel weight calibration.
 */
export const ANCIENT_RTP = 0.95;`
- Export a named return type from `lineWins` to align with project conventions and enable reuse
  - Before: `export function lineWins(symbols: Symbol[]): { symbol: Symbol; count: number } | null {`
  - After: `export interface LineMatch { readonly symbol: Symbol; readonly count: number; }

export function lineWins(symbols: Symbol[]): LineMatch | null {`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports. handleFreeSpins particularly needs a note on in-place mutation.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across the entire reel grid.
 * @param reels - 2D array of symbols indexed [column][row]
 * @returns total SCATTER count
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- JSDoc for handleFreeSpins should document mutation and all three state-transition branches.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Applies free-spin state transitions based on scatter count. Mutates `state` in place.
 * - Not active + ≥3 scatters → activates, sets remaining = 10
 * - Active + ≥3 scatters → adds 10 (retrigger)
 * - Active + <3 scatters → decrements remaining; deactivates at 0
 * @param state - persistent FreeSpinState object; mutated directly
 * @param scatters - SCATTER count returned by detectScatters for this spin
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`

### `src/legacy.ts` — 6.5/10

**Failed rules:**

- Rule 13: Security (HIGH)

- Fix float-precision payout by keeping arithmetic in integer coin-units
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Multiply before dividing to minimise IEEE 754 error; both operands are integers when bet∈[1..100]
return (multiplier * bet) / 10;`
- Use ReadonlyArray for the non-mutated lineSymbols parameter
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number`
- Replace index-based for loop with for...of
  - Before: `for (let i = 0; i < lineSymbols.length; i++) {
    if (lineSymbols[i] === first || lineSymbols[i] === "WILD") {
      matchCount++;
    } else {
      break;
    }
  }`
  - After: `for (const sym of lineSymbols) {
    if (sym === first || sym === "WILD") {
      matchCount++;
    } else {
      break;
    }
  }`
- Add JSDoc to document WILD-substitution semantics and bet contract
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the payout for a single pay-line using legacy sequential-match rules.
 * Leading WILDs are substituted by the first non-WILD symbol; an all-WILD line pays 0.
 * @param lineSymbols - Symbols on the pay-line, left-to-right.
 * @param bet - Total bet in coins (integer 1–100). Per-line bet is bet/10 (assumes 10 lines).
 * @returns Payout in coins; 0 when fewer than 3 consecutive matches or line resolves to SCATTER.
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`

### `src/rng.ts` — 5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 15: Testability (MEDIUM)

- Replace Math.random() with crypto.getRandomValues() for a certifiable uniform draw, and accept an injectable rng for testability.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = cryptoRandom,
): T {
  if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = rng() * totalWeight;

function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}`
- Mark parameters readonly to prevent accidental mutation and express intent.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
