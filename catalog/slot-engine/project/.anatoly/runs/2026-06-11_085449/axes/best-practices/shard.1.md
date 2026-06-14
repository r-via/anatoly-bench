[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srcpaytablets) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 8/10 | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 5/10

**Failed rules:**

- Rule 2: No any (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (HIGH)

- Replace `any` with `number`/`Bet` on both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: number): number
export function spin(bet: Bet): SpinResult`
- Fix inverted house-edge math to achieve 95% RTP
  - Before: `if (total > 0) {
  total = total * (1 + HOUSE_EDGE); // yields 105% RTP
}`
  - After: `if (total > 0) {
  total = total * (1 - HOUSE_EDGE); // yields 95% RTP
}`
- Reject bets outside [1,100] and throw a proper Error
  - Before: `if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
  throw "invalid bet";
}
if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (typeof bet !== "number" || bet < 1 || bet > 100 || !Number.isInteger(bet)) {
  throw new Error(`Invalid bet: ${bet}. Must be an integer in [1, 100].`);
}`
- Pass the injected RNG into the factory so the container actually controls randomness
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
// ...
const reels = factory.buildReels(5, 3); // rng ignored`
  - After: `const rng = container.resolve<typeof weightedPick>("rng");
// ...
const reels = factory.buildReels(5, 3, rng); // factory uses injected rng`
- Add readonly to PAYLINES and use satisfies for literal-type narrowing
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...entries...
] as const satisfies readonly number[][];`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace Math.random() with the project's src/rng.ts abstraction and inject it as a parameter for both regulated-gaming compliance and deterministic testability.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: readonly number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Mark all module-level constants as readonly and use Record<Symbol, number> for ReelWeightConfig.
  - Before: `const SYMBOLS: Symbol[] = [...];
interface ReelWeightConfig { CHERRY: number; LEMON: number; ... }
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...]`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
type ReelWeightConfig = Record<Symbol, number>;
const DEFAULT_WEIGHTS = { ... } satisfies Readonly<ReelWeightConfig>;
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...]`
- Return readonly number[] from getReelWeights to prevent callers from mutating the live weight table.
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length})`);
  }
  return REEL_WEIGHTS[reelIndex];
}`

### `src/paytable.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Lock PAY_TABLE with `as const` and tighten key type to the pay-symbol subset
  - Before: `const PAY_TABLE: Record<string, [number, number, number]> = {
  CHERRY:  [2,   5,   25],
  ...
};`
  - After: `type PaySymbol = Exclude<Symbol, "WILD" | "SCATTER">;

const PAY_TABLE = {
  CHERRY:  [2,   5,   25],
  ...
} as const satisfies Record<PaySymbol, readonly [number, number, number]>;`
- Add JSDoc to all public exports
  - Before: `export const ANCIENT_RTP = 0.95;

export function getPayMultiplier(symbol: Symbol, count: number): number {`
  - After: `/** Theoretical Return-to-Player ratio targeted by the engine (95%). */
export const ANCIENT_RTP = 0.95;

/**
 * Returns the base payout multiplier for a (symbol, run-length) pair.
 * WILD and SCATTER return 0.
 */
export function getPayMultiplier(symbol: Symbol, count: number): number {`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports to document parameters, return values, and side-effects (especially mutation for `handleFreeSpins`).
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts all SCATTER symbols across the entire reel grid.
 * @param reels - Full reel window (5 × 3).
 * @returns Total number of SCATTER symbols visible.
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Add JSDoc for `handleFreeSpins` documenting its mutation contract.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Mutates `state` in place according to free-spin transition rules.
 * - Not active + ≥3 scatters → activates, sets remaining = 10.
 * - Active + ≥3 scatters → adds 10 to remaining (retrigger).
 * - Active + <3 scatters → decrements remaining; deactivates at 0.
 * @param state - Persistent free-spin state (mutated in place).
 * @param scatters - Scatter count from the current spin.
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`

### `src/legacy.ts` — 8/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Use ReadonlyArray to express non-mutation intent on the lineSymbols parameter
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace index-based loop with for...of to improve readability and eliminate manual index access
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
- Compute payout in integer coin space to avoid IEEE 754 rounding on gambling payouts
  - Before: `const lineBet = bet / 10;
  return multiplier * lineBet;`
  - After: `// Multiply first, divide last — keeps arithmetic in safe integer range for bet 1..100
  return (multiplier * bet) / 10;`
- Add JSDoc covering WILD substitution, SCATTER behaviour, match minimum, and bet invariant
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the legacy line payout for a single evaluated pay line.
 *
 * - WILD at position 0 is substituted by the first non-WILD symbol.
 * - Lines starting with SCATTER (after WILD resolution) always return 0.
 * - Requires ≥3 consecutive matching symbols (WILD counts as any); shorter runs return 0.
 *
 * @param lineSymbols - Ordered symbols on the pay line (left-to-right).
 * @param bet - Total bet in coins (1..100, integer per README invariant).
 * @returns Payout in coins, or 0 for no win.
 */
export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`

### `src/rng.ts` — 5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Use `crypto.getRandomValues()` via a certifiable RNG abstraction instead of `Math.random()` for regulated gaming compliance.
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const roll = (crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000) * totalWeight;`
- Make parameters readonly and accept an injectable RNG for testability.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = secureRandom): T {`
- Guard against empty input arrays to avoid returning `undefined` typed as `T`.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = secureRandom): T {
  if (items.length === 0 || items.length !== weights.length) {
    throw new RangeError(`weightedPick: items (${items.length}) and weights (${weights.length}) must be non-empty and equal length`);
  }`
