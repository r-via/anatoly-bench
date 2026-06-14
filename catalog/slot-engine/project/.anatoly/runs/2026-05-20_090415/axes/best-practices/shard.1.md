[← Back to Best Practices](./index.md) · [← Back to report](../../public_report.md)

# ✅ Best Practices — Shard 1

- [📊 Findings](#-findings)
- [🔍 Details](#-details)

## 📊 Findings

| File | Verdict | BP Score | Details |
|------|---------|----------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 3.5/10 | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3.5/10 | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 9.5/10 | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 4.5/10 | [details](#srcrngts) |

## 🔍 Details

### `src/engine.ts` — 3.5/10

**Failed rules:**

- Rule 2: No `any` (CRITICAL)
- Rule 8: ESLint compliance (HIGH)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `any` with the already-defined `Bet` type on both exported functions
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number {
export function spin(bet: any): SpinResult {`
  - After: `export function computePayout(lineWins: LineWin[], bet: Bet): number {
export function spin(bet: Bet): SpinResult {`
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house edge — multiply by (1 - HOUSE_EDGE) to reduce payout to 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Make PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES = [
  // ...
] as const satisfies readonly (readonly number[])[];`
- Add JSDoc to the exported spin() function
  - Before: `export function spin(bet: Bet): SpinResult {`
  - After: `/**
 * Executes a single slot spin for the given coin bet.
 * @param bet - Integer coin bet in range 1–100
 * @returns SpinResult with reels, line wins, scatter/jackpot state, and total payout
 * @throws {Error} If bet is not a valid integer in range 1–100
 */
export function spin(bet: Bet): SpinResult {`

### `src/reels.ts` — 3.5/10

**Failed rules:**

- Rule 5: Immutability (MEDIUM)
- Rule 9: JSDoc on public exports (MEDIUM)
- Rule 13: Security (CRITICAL)

- Replace Math.random() with an injectable RNG from src/rng.ts to satisfy regulated gaming requirements
  - Before: `function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = Math.random() * total;`
  - After: `type RngFn = () => number;

function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: RngFn): Symbol {
  const total = wts.reduce((s, w) => s + w, 0);
  const r = rng() * total;`
- Apply readonly / as const satisfies to module-level constants and fix return types
  - Before: `const SYMBOLS: Symbol[] = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
];
const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
const REEL_WEIGHTS: number[][] = [...];

export function getReelWeights(reelIndex: number): number[] {
  return REEL_WEIGHTS[reelIndex];
}`
  - After: `const SYMBOLS = [
  "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
] as const satisfies readonly Symbol[];
const DEFAULT_WEIGHTS = { ... } as const satisfies Readonly<ReelWeightConfig>;
const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];

export function getReelWeights(reelIndex: number): readonly number[] {
  return REEL_WEIGHTS[reelIndex];
}`
- Use Record<Symbol, number> for ReelWeightConfig
  - Before: `interface ReelWeightConfig {
  CHERRY: number; LEMON: number; BELL: number; BAR: number;
  SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
}`
  - After: `type ReelWeightConfig = Record<Symbol, number>;`
- Add bounds guard to spinReel to prevent undefined weights crashing at runtime
  - Before: `export function spinReel(reelIndex: number): Symbol[] {
  const weights = REEL_WEIGHTS[reelIndex];`
  - After: `export function spinReel(reelIndex: number): Symbol[] {
  if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
    throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
  }
  const weights = REEL_WEIGHTS[reelIndex];`
- Add JSDoc to all public exports documenting valid parameter ranges
  - Before: `export function spinReel(reelIndex: number): Symbol[] {`
  - After: `/**
 * Spin a single reel column.
 * @param reelIndex - Reel index in [0, 4]
 * @returns 3 symbols sampled from the weighted distribution for that reel
 * @throws RangeError if reelIndex is out of bounds
 */
export function spinReel(reelIndex: number): Symbol[] {`

### `src/freespin.ts` — 9.5/10

**Failed rules:**

- Rule 9: JSDoc on public exports (MEDIUM)

- Add JSDoc to both public exports to document parameters and the intentional mutation contract.
  - Before: `export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`
  - After: `/**
 * Advances free-spin state based on scatter count for the current spin.
 * Mutates `state` in place; returns void.
 * @param state - Persistent free-spin state shared across spins.
 * @param scatters - Number of SCATTER symbols counted in the current spin.
 */
export function handleFreeSpins(state: FreeSpinState, scatters: number): void {`

### `src/rng.ts` — 4.5/10

**Failed rules:**

- Rule 13: Security (CRITICAL)
- Rule 17: Context-adapted rules (MEDIUM)

- Replace `Math.random()` with an injectable RNG parameter (defaults to `crypto.getRandomValues`-backed source) for both certification compliance and testability.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = Math.random() * totalWeight;`
  - After: `function cryptoRandom(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x1_0000_0000;
}

export function weightedPick<T>(
  items: readonly T[],
  weights: readonly number[],
  random: () => number = cryptoRandom,
): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = random() * totalWeight;`
- Add `readonly` to both parameters to signal immutability at the call site.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
