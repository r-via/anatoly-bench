[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 9/10 | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 7.5/10 | [details](#srclegacyts) |

## 🔍 Details

### `src/engine.ts` — 1/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 12: Async/Promises/Error handling (HIGH)
- Rule 13: Security (CRITICAL)

- Apply the declared `Bet` type to both public signatures instead of `any`
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix inverted house-edge formula — critical RTP compliance fix for regulated gaming
  - Before: `if (total > 0) {
  total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 → RTP > 100%
}`
  - After: `if (total > 0) {
  total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 → RTP ≈ 95%
}`
- Throw an Error object, not a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove unused container resolutions or route them into the call path
  - Before: `const rng = container.resolve<typeof weightedPick>("rng");
const paytable = container.resolve<typeof getPayMultiplier>("paytable");
const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");`
  - After: `// Register and resolve factory/strategy/emitter via container so they are injectable in tests
const paytable = container.resolve<typeof getPayMultiplier>("paytable");`
- Make PAYLINES immutable and use satisfies for stronger element typing
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  [1, 1, 1, 1, 1],
  // ...
] as const satisfies ReadonlyArray<readonly [number, number, number, number, number]>;`
- Add JSDoc to the primary public export
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `/**
 * Executes a single slot spin for the given integer bet (1–100 coins).
 * @throws {Error} If bet is not a positive integer.
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 3/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace `Math.random()` with the project's dedicated `src/rng.ts` module and inject RNG as a parameter for testability.
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: readonly number[], rng: () => number): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Mark module-level constants as deeply readonly and return copies from public accessors to enforce the 'read-only at runtime' contract.
  - Before: `const SYMBOLS: Symbol[] = [...];
const REEL_WEIGHTS: number[][] = [...];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS: readonly Symbol[] = [...] as const;
const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];

export function getReelWeights(reelIndex: number): readonly number[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  }
  return REEL_WEIGHTS[reelIndex];
}`
- Use `Record<Symbol, number>` for `ReelWeightConfig` and `satisfies` for `DEFAULT_WEIGHTS` to stay DRY and leverage TS 5.5+ narrowing.
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}

const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };`
  - After: `type ReelWeightConfig = Record<Symbol, number>;

const DEFAULT_WEIGHTS = {
  CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
  SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
} satisfies ReelWeightConfig;`
- Add JSDoc to all three public exports.
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spins a single reel and returns a 3-symbol column.
 * @param reelIndex - Reel index in [0, 4].
 * @throws {RangeError} if reelIndex is out of bounds.
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports to document mutation semantics and the state-machine transitions
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Advances free-spin state based on scatter count for the current spin.
 * Mutates `state` in place. Triggers on ≥ 3 scatters, retriggering adds 10.
 * @param state - Persistent free-spin state object (mutated).
 * @param scatters - Scatter count from the current spin grid.
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Replace Math.random() with crypto.getRandomValues() for regulated gaming compliance
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const buf = new Uint32Array(1);
crypto.getRandomValues(buf);
const roll = (buf[0] / 0x1_0000_0000) * totalWeight;`
- Inject RNG function to decouple from global state and enable deterministic testing
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(
  items: ReadonlyArray<T>,
  weights: ReadonlyArray<number>,
  rng: () => number = defaultRng,
): T {`
- Use ReadonlyArray for parameters that are not mutated
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {`
- Guard against empty or mismatched inputs to surface bugs early
  - Before: `const totalWeight = weights.reduce((sum, w) => sum + w, 0);`
  - After: `if (items.length === 0 || weights.length !== items.length) {
  throw new Error(`weightedPick: expected ${items.length} weights, got ${weights.length}`);
}
const totalWeight = weights.reduce((sum, w) => sum + w, 0);`

### `src/jackpot.ts` — 9/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Extract the jackpot threshold into a named constant for auditability in regulated gaming contexts.
  - Before: `return diamondCount >= 4;`
  - After: `const JACKPOT_DIAMOND_THRESHOLD = 4 as const;
return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;`
- Add JSDoc to the public export documenting the threshold and grid assumptions.
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Returns `true` when the grid contains 4 or more DIAMOND symbols.
 * Scans the full grid (not payline-restricted).
 * @param reels - 5×3 reel grid produced by a single spin.
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`

### `src/legacy.ts` — 7.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (HIGH)

- Mark the array parameter readonly since it is never mutated
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Use integer arithmetic for payouts to avoid IEEE 754 drift in regulated gaming
  - Before: `const lineBet = bet / 10;
return multiplier * lineBet;`
  - After: `// Keep everything in integer coins; caller divides by 10 for display
return multiplier * bet; // divide by 10 at display layer only`
- Validate bet bounds per the arbitrated README contract
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  if (!Number.isInteger(bet) || bet < 1 || bet > 100) throw new RangeError(`bet must be integer 1–100, got ${bet}`);`
- Add JSDoc documenting parameters, return value, and edge cases
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `/**
 * Computes the payout for a single payline using the legacy (non-wild-multiplier) algorithm.
 * @param lineSymbols - Symbols on the evaluated payline, left to right (length 1–5).
 * @param bet - Total bet in coins (integer, 1–100). Per-line bet = bet / 10.
 * @returns Payout in coins, or 0 for no win / SCATTER first symbol.
 */
export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
