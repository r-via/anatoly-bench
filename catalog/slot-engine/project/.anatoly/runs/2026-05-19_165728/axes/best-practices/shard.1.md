[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 8.5/10 | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` with the `Bet` type on both public exports
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number
export function spin(bet: any): SpinResult`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number
export function spin(bet: Bet): SpinResult`
- Fix inverted house edge to correctly target 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES immutable to prevent accidental mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies readonly (readonly number[])[];`
- Remove redundant wild-count recomputation and no-op event listener
  - Before: `let wildMultiplier = 1;
for (const w of wins) {
  const lineSymbols = PAYLINES[w.lineIndex].map((row, col) => reels[col][row]);
  let wc = 0;
  for (let k = 0; k < w.count; k++) {
    if (lineSymbols[k] === "WILD") wc++;
  }
  if (wc > 0) {
    wildMultiplier = Math.max(wildMultiplier, (1 + wc) * 2 ** wc);
  }
}
// ...
emitter.on(SPIN_DONE, () => {});
emitter.emit(SPIN_DONE, finalResult);`
  - After: `// Carry wildCount out of evaluateLine so spin can read it directly.
// Remove the post-hoc recomputation loop entirely.
// Remove the no-op listener — emit only:
emitter.emit(SPIN_DONE, finalResult);`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Inject RNG dependency to centralize auditable randomness and enable deterministic testing
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = Math.random): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Use `as const` and `Readonly` to prevent accidental mutation of module-level constants
  - Before: `const SYMBOLS: Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [ ... ];`
  - After: `const SYMBOLS = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const satisfies Symbol[];
const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
const REEL_WEIGHTS: readonly (readonly number[])[] = [ ... ];`
- Return a frozen copy from `getReelWeights` to prevent external weight mutation
  - Before: `export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `export function getReelWeights(reelIndex: number): readonly number[] {
  return Object.freeze([...REEL_WEIGHTS[reelIndex]]);
}`

### `src/factories.ts` — 8.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Return an immutable nested array to match the ReadonlyArray<ReadonlyArray<Symbol>> contract used downstream in SpinResult.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Inject the reel-spin function so StandardReelBuilderFactory is testable without touching module state.
  - Before: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  constructor(private readonly reelSpinner: (index: number) => Symbol[] = spinReel) { super(); }
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Add JSDoc to both exported classes and the buildReels method.
  - Before: `export abstract class AbstractReelBuilderFactory {`
  - After: `/** Base factory for building reel grids. Extend to supply a custom spin strategy. */
export abstract class AbstractReelBuilderFactory {`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to `detectScatters` to document the grid-wide (non-payline) counting behavior.
  - Before: `export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
  - After: `/**
 * Counts SCATTER symbols across the entire reel grid (not restricted to paylines).
 * @param reels - 2-D reel array (columns × rows)
 * @returns Total number of SCATTER symbols visible
 */
export function detectScatters(reels: ReadonlyArray<ReadonlyArray<Symbol>>): number {`
- Add JSDoc to `handleFreeSpins` to document the in-place mutation semantics and the three distinct state transitions.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Mutates `state` in place according to free-spin transition rules:
 * - 3+ scatters, not active → activates, sets remaining = 10
 * - 3+ scatters, already active → adds 10 to remaining (re-trigger)
 * - active, fewer than 3 scatters → decrements remaining; deactivates at 0
 * @param state - Mutable free-spin state maintained by the caller across spins
 * @param scatters - Scatter count from `detectScatters` for the current spin
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`

### `src/jackpot.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to the exported function to document the jackpot threshold and grid contract.
  - Before: `export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`
  - After: `/**
 * Returns `true` when 4 or more DIAMOND symbols appear anywhere on the reel grid.
 * @param reels - The 5 × 3 reel grid produced by a spin.
 * @returns Whether the jackpot condition is met.
 */
export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)

- Make array parameters readonly to signal non-mutation and satisfy rule 5.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Replace Math.random() with crypto.getRandomValues() for regulated gaming compliance (rule 13).
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const roll = (crypto.getRandomValues(new Uint32Array(1))[0] / 0x1_0000_0000) * totalWeight;`
- Inject the RNG source for testability (rule 15). Default keeps backward compatibility.
  - Before: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
  - After: `export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 0x1_0000_0000,
): T {`
- Add @param and @returns JSDoc tags for the public export (rule 9).
  - Before: `/**
 * Weighted random pick utility, suitable for gaming RNG applications.
 * Uses a cumulative-weight approach with a uniform random draw.
 */`
  - After: `/**
 * Weighted random pick utility for gaming RNG applications.
 * Draws one item using a cumulative-weight uniform distribution.
 * @param items - Array of items to pick from.
 * @param weights - Parallel array of non-negative weights; must be the same length as `items`.
 * @param rng - Random source returning a value in [0, 1). Defaults to crypto.getRandomValues.
 * @returns The selected item.
 */`
